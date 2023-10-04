const express = require('express')
const axios = require('axios')
const _ = require('lodash')

const app = express()
const port = 3000

app.use(express.json())

app.get('/api/blog-stats', async (req, res) => {
  try {  
     const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
      headers: {
        'x-hasura-admin-secret':
          '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    })

    const blogData = response.data

    const totalBlogs = _.size(blogData)
    const longestTitleBlog = _.maxBy(blogData, 'title.length')
    const privacyBlogs = _.filter(blogData, (blog) =>
      _.includes(_.toLower(blog.title), 'privacy')
    );
    const uniqueTitles = _.uniqBy(blogData, 'title')

    const statistics = {
      totalBlogs,
      longestTitle: longestTitleBlog.title,
      privacyBlogCount: privacyBlogs.length,
      uniqueTitles: uniqueTitles.map((blog) => blog.title),
    };

    res.json(statistics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve required blog data' })
  }
})

app.get('/api/blog-search', (req, res) => {
  const query = req.query.query

  if (!query) {
    return res.status(400).json({ error: 'Not found' })
  }

  try {
    const matchingBlogs = _.filter(blogData, (blog) =>
      _.includes(_.toLower(blog.title), _.toLower(query))
    );

    res.json(matchingBlogs)
  } catch (error) {
    res.status(500).json({ error: 'Not found' })
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});



