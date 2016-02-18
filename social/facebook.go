package social

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/kyp/service"

	"github.com/kyp/auth"

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

		ClientID:     "1515896578706527", // change this to yours
		ClientSecret: "c34e40892330c13bb047809a163ff1b2",
		RedirectURL:  "http://test.enthoguthi.com/FBLogin", // change this to your webserver adddress
		Scopes:       []string{"email", "user_birthday", "user_location", "user_about_me"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://www.facebook.com/dialog/oauth",
			TokenURL: "https://graph.facebook.com/oauth/access_token",
		},
	}

	return fbConfig
}
func GetFacebookURL(c *gin.Context) string {

	// generate loginURL
	fbConfig := FBConfig()

	url := fbConfig.AuthCodeURL("")

	return url
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
	log.Debugf(aecontext, fmt.Sprintf("token %#v", token))
	user := &auth.User{
		Email:     fb_user.Email,
		Name:      fb_user.Username,
		Token:     *token,
		LoginType: "facebook",
	}

	var redir_url = ""
	if service.VerifyVolunteerRequest(c, user) {
		redir_url = "/volsuccess"
	}

	log.Debugf(aecontext, fmt.Sprintf("user %#v", user))
	if !auth.IsAuthenticated(c) {
		auth.CreateSession(c, user)
	}
	if redir_url == "" {
		auth.Redirect(c, redir_url)
	} else {
		auth.Redirect(c)
	}
}

func RefreshFacebookTokens(c *gin.Context) {
	if auth.IsAuthenticated(c) {
		user := auth.GetUser(c)
		if user.LoginType == "facebook" {
			aecontext := appengine.NewContext(c.Request)
			conf := FBConfig()
			toksource := conf.TokenSource(aecontext, &user.Token)
			sourceToken := oauth2.ReuseTokenSource(&user.Token, toksource)
			client := oauth2.NewClient(aecontext, sourceToken)
			client.Get("...")
			t, _ := sourceToken.Token()
			user.Token = *t
			auth.UpdateUser(c, &user)
			log.Debugf(aecontext, fmt.Sprintf("refresh tokens %#v", t))
		}
	}
}
