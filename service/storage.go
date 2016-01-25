package service

/*import (
	"github.com/kyp/store"
	"golang.org/x/net/context"
	"google.golang.org/cloud/storage"
	"log"
)

func ListObjects(b_name string) {
	ctx := context.Background()
	client := store.STORAGE_CLIENT

	var query *storage.Query
	for {
		// If you are using this package on App Engine Managed VMs runtime,
		// you can init a bucket client with your app's default bucket name.
		// See http://godoc.org/google.golang.org/appengine/file#DefaultBucketName.
		objects, err := client.Bucket(b_name).List(ctx, query)
		if err != nil {
			log.Fatal(err)
		}
		for _, obj := range objects.Results {
			log.Printf("object name: %s, size: %v", obj.Name, obj.Size)
		}
		// If there are more results, objects.Next will be non-nil.
		if objects.Next == nil {
			break
		}
		query = objects.Next
	}

	log.Println("paginated through all object items in the bucket you specified.")
}*/
