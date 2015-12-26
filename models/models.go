package models

type Record struct {
	Id   int64  `form:"id" binding:"required" datastore:"-" goon:"id"`
	Name string `form:"name" binding:"required"`
}
