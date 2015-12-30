package kyp  

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/geo"
	"github.com/kyp/models"
	"github.com/kyp/service"
	"net/http"
//	"log"
//        "google.golang.org/appengine"
)

func init() {
	// Starts a new Gin instance with no middle-ware
	r := gin.Default()

        r.GET("/", func(c *gin.Context) {
                c.String(200, "Hello World!")
        })

	// Define your handlers
	/*	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello World!")
	})*/
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

	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./assets")

	r.POST("/user", AddUser)

	r.GET("/user", ListUser)

	r.GET("/load", LoadConst)
	r.POST("/point", Point)

	r.GET("/home", Home)
        http.Handle("/", r)
        //appengine.Main()
	//log.Fatal(r.Run(":8080"))
}

func Home(c *gin.Context) {
	c.HTML(http.StatusOK, "home.html", gin.H{})
}
func getStore(c *gin.Context) *service.Connection {
	return service.New(c.Request)
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

func LoadConst(c *gin.Context) {
	geo.LoadPolygonFromFile(getStore(c))
}

func Point(c *gin.Context) {
        rec := &geo.Point{}
        c.BindJSON(rec)
	resp := geo.PointInPolygon(getStore(c), rec.Lat, rec.Lng)
	c.JSON(http.StatusOK, resp)
}
