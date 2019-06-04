'use strict'

var casing = require('match-casing')
var search = require('nlcst-search')
var nlcstToString = require('nlcst-to-string')
var position = require('unist-util-position')
var quotation = require('quotation')
var schema = require('./schema')

module.exports = diacritics

// List of all phrases.
var list = keys(schema)

function diacritics() {
  return transform

  // Search `tree` for violations.
  function transform(tree, file) {
    search(tree, list, searcher)

    function searcher(match, index, parent, phrase) {
      var value = nlcstToString(match)
      var replace = casing(schema[phrase], value)
      var message =
        'Replace ' + quotation(value, '`') + ' with ' + quotation(replace, '`')

      message = file.warn(
        message,
        {
          start: position.start(match[0]),
          end: position.end(match[match.length - 1])
        },
        phrase.replace(/\s+/g, '-').toLowerCase()
      )

      message.source = 'retext-diacritics'
      message.actual = value
      message.expected = [replace]
    }
  }
}

function keys(object) {
  var result = []
  var key

  for (key in object) {
    result.push(key)
  }

  return result
}
