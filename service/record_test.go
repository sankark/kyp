package service

import (
	/*	"github.com/stretchr/testify/assert"*/
	"github.com/kyp/service"
	"google.golang.org/appengine/aetest"
	"testing"
)

func TestListObject(t *testing.T) {
	c, done, _ := aetest.NewContext()
	defer done()
	ds := service.FromContext(c)
	ds.Add(service.Record{ID: 1, Name: "test"})

}
