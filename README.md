![Issues](https://img.shields.io/github/issues/ethanny2/webpack-lighthouse100-template) ![forks](https://img.shields.io/github/forks/ethanny2/webpack-lighthouse100-template) ![Stars](https://img.shields.io/github/stars/ethanny2/webpack-lighthouse100-template)  ![License](https://img.shields.io/github/license/ethanny2/webpack-lighthouse100-template) [![Twitter Badge](https://img.shields.io/badge/chat-twitter-blue.svg)](https://twitter.com/ArrayLikeObj)

# Webpack Lighthouse 100 Template


<p align="center">

<img src="https://media4.giphy.com/media/AZQvjAAkSmkYCkNaJM/giphy.gif" alt="Gif of lighthouse perfect 100 fireworks" />

</p>

##[Try it your self!](https://static-lighthouse100.netlify.app/)
 A template that utilizes the webpack (4) bundler along with its robust plugin environment to make a template that is optimized for best practices in a production environment.

***Note: Most of the rules in the webpack files have breif comments explaining them but if you want a more in-depth explaination of any of the more intracate details please see the README of this [Repo](https://github.com/ethanny2/threejs-es6-webpack-barebones-boilerplate) (Essentially this template uses the same config as the linked repo, the only difference is the other repo just uses Threejs. The explanations for the webpack rules should still apply).**

 ## Features
  
- ### Minification 
  - All HTML, CSS/SCSS, and JS files
- ### Dev Environment with Hot Module Reloading 
  - Works for HTML,CSS/SCSS, JS files
  - Ability to serve your static site over a local network (see command start-mobile-dev) to view on different real devices
- ### PurgeCSS 
  - To detect and remove unused CSS (essential when using styling libraries like Boostrap)
- ### Autoprefixer
  -  To automatically include vendor prefixes for CSS properties
- ### Cache Bursting
  -  A technique  used to invalidate old versions of the site when re-building
- ### All Static Assets in Webpack Dependency Graph
  - Import images, auido and CSS/SCSS/SASS files directly into your JavaScript as variables
- ### Image Compression
  - Uses ImageminPlugin to compress images used automatically
- ### Compression of all other static files
  - Gzip compression of all assets for faster speeds over the wire
- ### Chunking Strategy optimized for HTTPS/2 connections
  - [Source 1](https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758) 
  - [Source 2](https://calendar.perfplanet.com/2019/bundling-javascript-for-performance-best-practices/)

- ### Support for Netlify Serverless Functions 
  - Set up with the CopyWebpack plugin; also included is a netlify.toml if you are using the Netlify CLI


