const PORT = process.env.PORT || 1999
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    /*{
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-crisis'
    },*/
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})

app.get('/news/:newspaperId',  (req,res) => {
    const newspaperId = req.params.newspaperId 

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    //console.log(newspaperAddress);

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")',html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(eer=>  console.log(eer))

})

app.listen(PORT,()=> console.log(`Server running on PORT ${PORT}`))


app.get('/', (req, res)=>{
    res.json("Welcome to my climate API")
})

//get content from website
app.get('/news', (req,res)=>{

    res.json(articles)



    /*axios.get('https://www.theguardian.com/environment/climate-crisis')
    .then((response)=>{
        const html = response.data
        //console.log(html);
        //cheerio to pick the elements from the website
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function (){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url
            })
        })
        res.json(articles)
    }).catch((err)=> console.log(err))*/
})