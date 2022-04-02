const router = require("express").Router()
const { validatorCreatePost } = require("../validators/posts")
const { tokenVerify } = require("../utils/handleJWT")

const { listAll, addOne } = require("./postsController")
router.get("/", listAll)
    /*previous route could also receive Query params (aka query strings)
    Query parameters for longer, more readable URLs, which are followed by dynamic content, not relevant to search engines. Query params work almost the same way. But in contrast to URL params, we do not define what we expect.All parameters that have been received are available in the req.query object.
    A new parameter is always marked by the question mark. We can also pass multiple params in the URL. It is important that we separate them with an & sign. But we do not need another ?.
    in address bar: /user?name=marcelobettini&mail=marce@sarasa.com&age=102&... etc key+value*/

router.post("/", tokenVerify, validatorCreatePost, addOne)


module.exports = router