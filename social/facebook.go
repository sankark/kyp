package social

import (
	"encoding/json"
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/gin-gonic/gin"
	"github.com/kyp/log"
	"golang.org/x/oauth2"
	"google.golang.org/appengine/urlfetch"
)

type FB_User struct {
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

func FBConfig() *oauth2.Config {
	// generate loginURL
	fbConfig := &oauth2.Config{
		// ClientId: FBAppID(string), ClientSecret : FBSecret(string)
		// Example - ClientId: "1234567890", ClientSecret: "red2drdff6e2321e51aedcc94e19c76ee"

		ClientID:     "", // change this to yours
		ClientSecret: "",
		RedirectURL:  "https://cloud-certification-l300.appspot.com/FBLogin", // change this to your webserver adddress
		Scopes:       []string{"email", "user_birthday", "user_location", "user_about_me"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://www.facebook.com/dialog/oauth",
			TokenURL: "https://graph.facebook.com/oauth/access_token",
		},
	}

	return fbConfig
}
func Home(c *gin.Context) {

	// generate loginURL
	fbConfig := FBConfig()

	url := fbConfig.AuthCodeURL("")

	// Home page will display a button for login to Facebook
	c.HTML(http.StatusOK, "login.html", gin.H{
		"facebook_login": url,
		"google_login":   url,
		"twitter_login":  url,
	})
	//w.Write([]byte("<html><title>Golang Login Facebook Example</title> <body> <a href='" + facebook_login + "'><button>Login with Facebook!</button> </a> </body></html>"))
}

func FBLogin(c *gin.Context) {
	// grab the code fragment

	aecontext := appengine.NewContext(c.Request)

	code := c.Query("code")

	fbConfig := FBConfig()

	token, err := fbConfig.Exchange(aecontext, code)

	if err != nil {
		log.Errorf(aecontext, err.Error())
	}

	client := urlfetch.Client(aecontext)
	response, err := client.Get("https://graph.facebook.com/v2.5/me?fields=id,name,email&access_token=" + token.AccessToken)
	log.Debugf(aecontext, fmt.Sprintf("token.AccessToken %#v", token.AccessToken))

	// handle err. You need to change this into something more robust
	// such as redirect back to home page with error message
	if err != nil {
		c.String(http.StatusOK, "Error")
	}

	var fb_user FB_User
	log.Debugf(aecontext, fmt.Sprintf("fb_response %#v", response))
	Bind(response, &fb_user)
	log.Debugf(aecontext, fmt.Sprintf("fb_response %#v", fb_user))
	c.String(http.StatusOK, "Username %s email %s", fb_user.Username, fb_user.Email)
}
