package kyp  

import (
	"github.com/gin-gonic/gin"
	"github.com/kyp/geo"
	"github.com/kyp/models"
	"github.com/kyp/service"
	"net/http"
	"github.com/kyp/log"
//      "google.golang.org/appengine"
//      "github.com/dpapathanasiou/go-recaptcha"
)

func init() {
	// Starts a new Gin instance with no middle-ware
	r := gin.Default()
        r.Use(log.Logger())
        r.Use(gin.Recovery())
        
	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./assets")

	r.POST("/user", AddUser)
	r.GET("/user", ListUser)
	r.GET("/load", LoadConst)
	r.POST("/point", Point)
	r.GET("/", Home)
	
        http.Handle("/", r)
        //appengine.Main()
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
