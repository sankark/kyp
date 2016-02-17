package login

import (
	"net/http"

	"github.com/kyp/social"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	fb_url := social.GetFacebookURL(c)
	goog_url := social.GoogleLoginUrl(c)

	c.HTML(http.StatusOK, "login.html", gin.H{
		"facebook_login": fb_url,
		"google_login":   goog_url,
		"twitter_login":  "",
	})

}

func RefreshTokens() gin.HandlerFunc {
	return func(c *gin.Context) {
		social.RefreshFacebookTokens(c)
	}

}
