package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/service"
	"net/http"
)

func init() {
	// Starts a new Gin instance with no middle-ware
	r := gin.New()

	// Define your handlers
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello World!")
	})
	/*	r.GET("/ping", func(c *gin.Context) {
			c.String(200, "pong")
		})

		r.POST("/postRecord", func(c *gin.Context) {
			json := kyp.Record{}
			if c.BindJSON(&json) == nil {
				ctx := appengine.NewContext(c.Request)
				key := datastore.NewIncompleteKey(ctx, "Record", nil)
				datastore.Put(ctx, key, &json)
				c.JSON(http.StatusOK, gin.H{"user": json.Name})
			}
		})*/

	r.POST("/user", service.AddUser)

	r.GET("/user", service.ListUser)

	http.Handle("/", r)
}
