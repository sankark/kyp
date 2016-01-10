package models

import (
	"github.com/kyp/timestamp"
)

type Timestamp timestamp.Timestamp
type Record struct {
	Id   int64  `form:"id" binding:"required" datastore:"-" goon:"id"`
	Name string `form:"name" binding:"required"`
}
