package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/models"
	"github.com/kyp/service"
	"net/http"
)

var STORE *service.Connection

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

	r.POST("/user", AddUser)

	r.GET("/user", ListUser)

	http.Handle("/", r)
}

func getStore(c *gin.Context) *service.Connection {
	if STORE == nil {
		STORE = service.New(c.Request)
	}
	return STORE
}

func AddUser(c *gin.Context) {
	rec := &models.Record{}
	c.BindJSON(rec)
	DAO := getStore(c)
	resp := DAO.Add(rec)
	c.JSON(http.StatusOK, resp)
}

func ListUser(c *gin.Context) {
	rec := &[]models.Record{}
	DAO := getStore(c)
	resp := DAO.List(rec)
	c.JSON(http.StatusOK, resp)
}
