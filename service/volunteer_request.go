

func SendVolunteerRequest(c *gin.Context){
    user := auth.User
    c.JSON(&user)
    user.vol_req_id := uuid.NewV4().String()
    user.active := "false"
    conn.Add(user)
    SendEmail(c, user)
}

func ProcessVolunteerRequest(c *gin.Context){
    
}

func ApproveVolunteerRequest(c *gin.Context, user auth.User){
    
}

func SendEmail(c *gin.Context, user auth.User){
        r:= c.Request
        ctx := appengine.NewContext(r)
        addr := user.Email
        url := createConfirmationURL(r)
        msg := &mail.Message{
                Sender:  "support@test.enthoguthi.com",
                To:      []string{addr},
                Subject: "Confirm your volunteer request",
                Body:    fmt.Sprintf(confirmMessage, url),
        }
        if err := mail.Send(ctx, msg); err != nil {
                log.Errorf(c, "Couldn't send email: %v", err)
        }
}

func createConfirmationURL(user auth.User) string{
  
}
