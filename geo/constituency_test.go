package geo

import (
	/*	"github.com/stretchr/testify/assert"*/
	"github.com/kyp/geo"
	"github.com/kyp/service"
	/*	"golang.org/x/net/context"*/
	"google.golang.org/appengine/aetest"
	"testing"
	/*"time"*/)

func TestList(t *testing.T) {
	c, done, _ := aetest.NewContext()
	defer done()
	ds := service.FromContext(c)
	//geo.LoadPolygonFromFile(ds)
	//time.Sleep(10000)
	t.Log("calling")
	resp := geo.PointInPolygon(ds, 13.477646709852323, 80.18274600000001)
	t.Log("exiting")
	t.Log(resp)
}
