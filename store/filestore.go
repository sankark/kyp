package store

import (
	"net/http"

	"github.com/kyp/log"

	"github.com/gin-gonic/gin"

	"google.golang.org/appengine"
	"google.golang.org/appengine/blobstore"
)

func UploadUrl(c *gin.Context){
	r := c.Request
	ctx := appengine.NewContext(r)
	uploadURL, err := blobstore.UploadURL(ctx, "/upload", nil)
	var err_msg string
	
	if err != nil {
		log.Errorf(ctx, err.Error())
		err_msg = err.Error()
        }
        
        c.JSON(http.StatusOK, gin.H{"err": err_msg, "uploadURL": UploadURL})
	
}
func Serve(c *gin.Context) {
	r := c.Request
	w := c.Writer
	blobstore.Send(w, appengine.BlobKey(r.FormValue("blobKey")))
}

func Upload(c *gin.Context) {
	r := c.Request
	ctx := appengine.NewContext(r)
	var err_msg string

	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		log.Errorf(ctx, err.Error())
		err_msg = err.Error()
	}
	file := blobs["file"]
	if len(file) == 0 {
		log.Errorf(ctx, "file length is 0")
		err_msg = "file length is 0"
	}
	c.JSON(http.StatusOK, gin.H{"err": err_msg, "blobKey": string(file[0].BlobKey)})
}

func Delete(c *gin.Context, blobKey appengine.BlobKey) {
	r := c.Request
	appengine.NewContext(r)
	err := blobstore.Delete(c, blobKey)
	var err_msg string
	if err != nil {
		err_msg = "failed"
	}
	c.JSON(http.StatusOK, gin.H{"err": err_msg, "blobKey": string(blobKey)})
}

func ToBlobKey(c *gin.Context, key string) appengine.BlobKey {
	bk, _ := blobstore.BlobKeyForFile(c, key)
	return bk
}
