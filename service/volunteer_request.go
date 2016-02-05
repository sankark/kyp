package service

import (
	"fmt"
	"net/http"

	"github.com/kyp/store"
	"google.golang.org/appengine"

	"github.com/kyp/auth"

	"github.com/satori/go.uuid"

	"github.com/gin-gonic/gin"
	"github.com/kyp/log"
	"google.golang.org/appengine/mail"
)

func GetEnv() string {
	return "test"
}

func SendVolunteerRequest(c *gin.Context) {
	if auth.IsAuthenticated(c) {
		user := &auth.User{}
		conn := store.New(c)
		c.BindJSON(user)
		user.Temp_Req_Id = uuid.NewV4().String()
		user.Role = "pending"
		user.Ref_Email = auth.GetUser(c).Email
		conn.Add(user)
		SendEmailVolunteer(c, user)
		c.JSON(http.StatusOK, gin.H{"msg": "send email to volunteer"})
	} else {
		c.JSON(http.StatusOK, gin.H{"msg": "auth required"})
	}
}

func ProcessVolunteerRequest(c *gin.Context) {
	req_id := c.Param("req_id")
	auth.SessionSet(c, "vol_req_id", req_id)
	auth.SessionSave(c)
	c.Redirect(http.StatusTemporaryRedirect, "/login")
}

func VerifyVolunteerRequest(c *gin.Context, user *auth.User) bool {
	r := c.Request
	conn := store.New(c)
	conn.Get(user)
	ctx := appengine.NewContext(r)
	session := auth.GetSession(c)
	log.Debugf(ctx, fmt.Sprintf("details %#v", session))
	req_id := session.Get("vol_req_id")
	log.Debugf(ctx, fmt.Sprintf("Vol_Req_id %#v", req_id))
	log.Debugf(ctx, "Vol_Req_id %v", req_id)
	if req_id != nil {
		session.Delete("vol_req_id")
		session.Save()
		if req_id == user.Temp_Req_Id {
			user.Role = "volunteer"
			conn.Add(user)
			return true
		}
	} else {
		log.Debugf(ctx, "Vol_Req_id notfound")
		return false
	}
	return false
}

func SendEmailVolunteer(c *gin.Context, user *auth.User) {
	r := c.Request
	ctx := appengine.NewContext(r)
	addr := user.Email
	url := createConfirmationURL(user)
	msg := &mail.Message{
		Sender:  "govtam@gmail.com",
		To:      []string{addr},
		Subject: "Confirm your volunteer request",
		Body:    fmt.Sprintf(confirmMessage, url),
	}
	log.Debugf(ctx, "Mail msg %v", msg)
	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(c, "Couldn't send email: %v", err)
	}
}

func createConfirmationURL(user *auth.User) string {
	url := ""
	if GetEnv() == "prod" {
		url = "http://enthoguthi.com/volunteer/ack/" + user.Temp_Req_Id
	}
	if GetEnv() == "dev" {
		url = "http://localhost:8080/volunteer/ack/" + user.Temp_Req_Id
	}
	if GetEnv() == "test" {
		url = "http://test.enthoguthi.com/volunteer/ack/" + user.Temp_Req_Id
	}
	return url
}

const confirmMessage = `
Thank you for creating an account!
Please confirm your email address by clicking on the link below:

%s
`
