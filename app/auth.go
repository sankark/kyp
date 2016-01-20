package kyp

func Auth(){
	return func(c *gin.Context) {
	      	if value, exists := c.Get(gin.AuthUserKey); exists {
        		return value
        	}else{
        	  // facebook login here
        	}
	}
}
