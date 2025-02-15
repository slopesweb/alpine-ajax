const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')
const pluginWebc = require('@11ty/eleventy-plugin-webc')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css')

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)
  eleventyConfig.addPlugin(pluginWebc)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)

  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'direct-link',
      symbol: '#'
    }),
    level: [1, 2, 3, 4],
    slugify: eleventyConfig.getFilter('slugify')
  })
  eleventyConfig.setLibrary('md', markdownLibrary)
}
