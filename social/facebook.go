 package main

 import (
 	"fmt"
 	"github.com/antonholmquist/jason"
 	"github.com/golang/oauth2"
 	"net/http"
 	"strconv"
 	"strings"
 )

 type AccessToken struct {
 	Token  string
 	Expiry int64
 }
 
 func Home(c *gin.Context) {
 	

 	// generate loginURL
 	fbConfig := &oauth2.Config{
 		// ClientId: FBAppID(string), ClientSecret : FBSecret(string)
 		// Example - ClientId: "1234567890", ClientSecret: "red2drdff6e2321e51aedcc94e19c76ee"

 		ClientID:     "", // change this to yours
 		ClientSecret: "",
 		RedirectURL:  "http://<domain name and don't forget port number if you use one>/FBLogin", // change this to your webserver adddress
 		Scopes:       []string{"email", "user_birthday", "user_location", "user_about_me"},
 		Endpoint: oauth2.Endpoint{
 			AuthURL:  "https://www.facebook.com/dialog/oauth",
 			TokenURL: "https://graph.facebook.com/oauth/access_token",
 		},
 	}

 	url := fbConfig.AuthCodeURL("")

 	// Home page will display a button for login to Facebook
        c.HTML(http.StatusOK, "login.tmpl", gin.H{
            "facebook_login": url,
            "google_login": url,
            "twitter_login": url,
        })
 	//w.Write([]byte("<html><title>Golang Login Facebook Example</title> <body> <a href='" + facebook_login + "'><button>Login with Facebook!</button> </a> </body></html>"))
 }
 
 
 func FBLogin(c *gin.Context) {
 	// grab the code fragment

 	code := c.Query("code")
 	
 	fbConfig := &oauth2.Config{
 		// ClientId: FBAppID(string), ClientSecret : FBSecret(string)
 		// Example - ClientId: "1234567890", ClientSecret: "red2drdff6e2321e51aedcc94e19c76ee"

 		ClientID:     "", // change this to yours
 		ClientSecret: "",
 		RedirectURL:  "http://<domain name and don't forget port number if you use one>/FBLogin", // change this to your webserver adddress
 		Scopes:       []string{"email", "user_birthday", "user_location", "user_about_me"},
 		Endpoint: oauth2.Endpoint{
 			AuthURL:  "https://www.facebook.com/dialog/oauth",
 			TokenURL: "https://graph.facebook.com/oauth/access_token",
 		},
 	}
 	
 	token := fbConfig.Exchange(oauth2.NoContext, code)
 	
        client := urlfetch.Client(ctx)
 	response, err := client.Get("https://graph.facebook.com/me?access_token=" + token.AccessToken)

 	// handle err. You need to change this into something more robust
 	// such as redirect back to home page with error message
 	if err != nil {
 		c.String(http.StatusOK, "Error")
 	}

	type FB_User struct {
	    Id     string `form:"id" json:"id" binding:"required"`
	    Email string `form:"email" json:"email" binding:"required"`
	    Username string `form:"username" json:"username" binding:"required"`
	}
	
        var fb_user FB_User
        c.BindJSON(&fb_user)
        c.String(http.StatusOK, "Username %s email %s", fb_user.Username, fb_user.Email)
 }

 

