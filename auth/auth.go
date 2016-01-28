package auth

import (
	"net/http"
	"time"

	"github.com/kyp/sessions"

	"github.com/kyp/store"

	"github.com/gin-gonic/gin"
)

type User struct {
	Name     string   `json:"name"`
	Email    string   `json:"id" binding:"required" datastore:"-" goon:"id"`
	Consti   []string `json:"consti_ids"`
	Comments []string `json:"comment_ids"`
	Likes    []string `json:"like_ids"`
	Unlikes  []string `json:"unlike_ids"`
	Role     string
	Active   string
}

var RedirectURL = "RedirectURL"

func Login(c *gin.Context) {
	SessionSet(c, RedirectURL, c.Request.URL.Path)
	SessionSave(c)
	c.Redirect(http.StatusTemporaryRedirect, "/login")
}

func SessionSet(c *gin.Context, key interface{}, value interface{}) {
	session := sessions.Default(c)
	session.Set(key, value)
}

func SessionGet(c *gin.Context, key interface{}) interface{} {
	session := sessions.Default(c)
	return session.Get(key)
}

func SessionSave(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("internal")
	session.Save()
}

func IsAuthenticated(c *gin.Context) bool {
	email := SessionGet(c, gin.AuthUserKey)
	if email != nil {
		SessionSet(c, "timestamp", time.Now().Format("2006-01-02 15-04-05"))
		GetUser(c)
		return true
	}
	return false
}

func CreateSession(c *gin.Context, user *User) {
	AddUser(c, user)
	SessionSet(c, "timestamp", time.Now().Format("2006-01-02 15-04-05"))
	SessionSet(c, gin.AuthUserKey, user.Email)
	SessionSave(c)
}

func IsAuthorized(c *gin.Context, consti string) bool {
	if Contains(c, consti) && IsAuthenticated(c) {
		return true
	} else {
		return false
	}
}

func GetUserId(c *gin.Context) string {
	return SessionGet(c, gin.AuthUserKey).(string)
}

func GetUser(c *gin.Context) User {
	user := SessionGet(c, "internal")
	if user != nil {
		return user.(User)
	}
	conn := store.New(c)
	user2 := User{Email: GetUserId(c)}
	conn.Get(&user2)
	SessionSet(c, "internal", user2)
	return user2
}

func AddUser(c *gin.Context, user *User) {
	conn := store.New(c)
	resp := conn.Get(user)
	if resp.Err_msg != "" {
		user.Active = "false"
		user.Role = "support"
		conn.Add(user)
	}

}

func Redirect(c *gin.Context) {
	if SessionGet(c, RedirectURL) != nil {
		c.Redirect(http.StatusTemporaryRedirect, SessionGet(c, RedirectURL).(string))
	}
}

func Contains(c *gin.Context, key string) bool {
	user := GetUser(c)
	if user.Role == "admin" {
		return true
	}
	for _, value := range user.Consti {
		if value == key {
			return true
		}
	}
	return false
}

func TestLogin(c *gin.Context) {
	user := &User{
		Email: "test",
		Name:  "test",
	}
	if !IsAuthenticated(c) {
		CreateSession(c, user)
	}
	Redirect(c)
}