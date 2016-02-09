package service

import (
	"net/http"

	"github.com/kyp/store"

	"github.com/kyp/auth"

	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) {
	if auth.IsAdmin(c) {
		user_id := c.Param("user_id")
		user := &auth.User{}
		user.Email = user_id
		conn := store.New(c)
		conn.Get(user)
		c.JSON(http.StatusOK, gin.H{"status": "success", "user": user})
	} else {
		c.JSON(http.StatusOK, gin.H{"msg": "auth required"})
	}
}

func ListUser(c *gin.Context) {
	if auth.IsAdmin(c) {
		users := make([]auth.User, 0)
		conn := store.New(c)
		conn.List(&users)

		c.JSON(http.StatusOK, users)
	} else {
		c.JSON(http.StatusOK, gin.H{"msg": "auth required"})
	}
}

func UpdateUser(c *gin.Context) {
	if auth.IsAdmin(c) {
		user := &auth.User{}
		c.BindJSON(user)
		conn := store.New(c)
		conn.Add(user)
		c.JSON(http.StatusOK, gin.H{"status": "success", "user": user})
	} else {
		c.JSON(http.StatusOK, gin.H{"msg": "auth required"})
	}
}
