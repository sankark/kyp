package social

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/kyp/auth"

	"google.golang.org/appengine"

	"github.com/gin-gonic/gin"
	"github.com/kyp/log"
	"golang.org/x/oauth2/google"
	"google.golang.org/appengine/urlfetch"
)

type GoogleUser struct {
	Id       string `form:"id" json:"id" binding:"required"`
	Email    string `form:"email" json:"email" binding:"required"`
	Username string `form:"name" json:"name" binding:"required"`
}

func Bind(res *http.Response, obj interface{}) error {
	decoder := json.NewDecoder(res.Body)
	if err := decoder.Decode(obj); err != nil {
		return err
	}
	return nil
}

func GoogleConfig() *oauth2.Config {
	// generate loginURL
googleconf = &oauth2.Config{
        ClientID:     "your-client-id",
        ClientSecret: "youe-secred",
        RedirectURL:  "http://localhost:300/googlelogin",
        Scopes: []string{
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        },
        Endpoint: google.Endpoint,
    }
	return googleconf
}
func GoogleLoginUrl(c *gin.Context) {

	// generate loginURL
	googleconf := GoogleConfig()

	url := googleconf.AuthCodeURL("state")

	return url
}

func  GoogleLogin(c *gin.Context) {
	// grab the code fragment

	aecontext := appengine.NewContext(c.Request)

	code := c.Query("code")

	googleconf := GoogleConfig()

	token, err := googleconf.Exchange(aecontext, code)

	if err != nil {
		log.Errorf(aecontext, err.Error())
	}

	client := urlfetch.Client(aecontext)
	response, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	log.Debugf(aecontext, fmt.Sprintf("token.AccessToken %#v", token.AccessToken))

	// handle err. You need to change this into something more robust
	// such as redirect back to home page with error message
	if err != nil {
		c.String(http.StatusOK, "Error")
	}

	var goog_user GoogleUser
	log.Debugf(aecontext, fmt.Sprintf("fb_response %#v", response))
	Bind(response, &goog_user)
	log.Debugf(aecontext, fmt.Sprintf("fb_response %#v", goog_user))
	user := &auth.User{
		Email: goog_user.Email,
		Name:  goog_user.Username,
	}
	log.Debugf(aecontext, fmt.Sprintf("user %#v", user))
	if !auth.IsAuthenticated(c) {
		auth.CreateSession(c, user)
	}
	auth.Redirect(c)
}
