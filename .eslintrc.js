//ESlintrc.js (eslint version 3.10.2)
module.exports = {

  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {                             // http://eslint.org/docs/user-guide/configuring#specifying-language-options
      'modules': true,                            // enable modules and global strict mode
      'globalReturn': false,                      // allow return statements in the global scope
      'jsx': false                                // enable JSX
    }
  },

  'env': {                                        // http://eslint.org/docs/user-guide/configuring#specifying-environments
    'es6': true,                                  // enable all ECMAScript 6 features except for modules.
    'node': true,                                 // Node.js global variables and Node.js-specific rules.
    'browser': true,                              // browser global variables.
    'jquery': false,                              // jquery global variables.
    'commonjs': false,                            // CommonJS global variables and CommonJS scoping
    'amd': false,                                 // defines require() and define() as global variables as per the amd spec.
    'mocha': true,                                // adds all of the Mocha testing global variables.
    'worker': false,                              // Web workers global variables.
    'jasmine': false,                             // adds all of the Jasmine testing global variables for version 1.3 and 2.0.
    'phantomjs': false,                           // phantomjs global variables.
    'protractor': false,                          // Protractor global variables.
    'prototypejs': false,                         // prototypejs global variables.
    'webextensions': false,                       // WebExtensions globals.
    'shelljs': false                              // shelljs global variables.
  },

  'globals': {
    'expect': true,
    'chai': true,
    'fetch': true
  },

  'plugins': ['babel'],

  'rules': {                                      // http://eslint.org/docs/rules/

    ////////// Possible Errors //////////

    'no-cond-assign': 2,                          // disallow assignment in conditional expressions
    'no-console': 0,                              // disallow use of console (off by default in the node environment)
    'no-constant-condition': 2,                   // disallow use of constant expressions in conditions
    'no-control-regex': 2,                        // disallow control characters in regular expressions
    'no-debugger': 0,                             // disallow use of debugger
    'no-dupe-args': 2,                            // disallow duplicate arguments in functions
    'no-dupe-keys': 2,                            // disallow duplicate keys when creating object literals
    'no-duplicate-case': 2,                       // disallow a duplicate case label
    'no-empty-character-class': 2,                // disallow the use of empty character classes in regular expressions
    'no-empty': 2,                                // disallow empty statements
    'no-ex-assign': 2,                            // disallow assigning to the exception in a catch block
    'no-extra-boolean-cast': 2,                   // disallow double-negation boolean casts in a boolean context
    'no-extra-parens': [2,'all', {                // disallow unnecessary parentheses
      'nestedBinaryExpressions': false
    }],
    'no-extra-semi': 2,                           // disallow unnecessary semicolons
    'no-func-assign': 2,                          // disallow overwriting functions written as function declarations
    'no-inner-declarations': [2, 'both'],         // disallow function or variable declarations in nested blocks
    'no-invalid-regexp': 2,                       // disallow invalid regular expression strings in the RegExp constructor
    'no-irregular-whitespace': 2,                 // disallow irregular whitespace outside of strings and comments
    'no-obj-calls': 2,                            // disallow the use of object properties of the global object (Math and JSON) as functions
    'no-prototype-builtins': 2,                   // Disallow use of Object.prototypes builtins directly (no-prototype-builtins)
    'no-regex-spaces': 2,                         // disallow multiple spaces in a regular expression literal
    'no-sparse-arrays': 2,                        // disallow sparse arrays
    'no-template-curly-in-string': 2,             // disallow template literal placeholder syntax in regular strings
    'no-unexpected-multiline': 2,                 // Avoid code that looks like two expressions but is actually one
    'no-unreachable': 2,                          // disallow unreachable statements after a return, throw, continue, or break statement
    'no-unsafe-finally': 2,                       // disallow control flow statements in finally blocks
    'no-unsafe-negation': 2,                      // disallow negating the left operand of relational operators
    'use-isnan': 2,                               // disallow comparisons with the value NaN
    'valid-jsdoc': [2, {                          // ensure JSDoc comments are valid
      'requireReturn': false,
      'requireParamDescription': true,
      'requireReturnDescription': false,
      'requireReturnType': false,
      'prefer': {
        'return': 'return'
      }
    }],
    'valid-typeof': 2,                            // Ensure that the results of typeof are compared against a valid string


    ////////// Best Practices //////////

    'accessor-pairs': 2,                          // enforces getter/setter pairs in objects
    'array-callback-return': 2,                   // enforce return statements in callbacks of array methods
    'block-scoped-var': 2,                        // treat var statements as if they were block scoped
    'class-methods-use-this': 2,                  // enforce that class methods utilize this
    'complexity': [2, 5],                         // specify the maximum cyclomatic complexity allowed in a program
    'consistent-return': 2,                       // require return statements to either always or never specify values
    'curly': 2,                                   // specify curly brace conventions for all control statements
    'default-case': 2,                            // require default case in switch statements
    'dot-location': [2, 'property'],              // enforces consistent newlines before or after dots
    'dot-notation': 2,                            // encourages use of dot notation whenever possible
    'eqeqeq': 2,                                  // require the use of === and !==
    'guard-for-in': 2,                            // make sure for-in loops have an if statement
    'no-alert': 2,                                // disallow the use of alert, confirm, and prompt
    'no-caller': 2,                               // disallow use of arguments.caller or arguments.callee
    'no-case-declarations': 2,                    // disallow lexical declarations in case clauses
    'no-div-regex': 2,                            // disallow division operators explicitly at beginning of regular expression
    'no-else-return': 2,                          // disallow else after a return in an if
    'no-empty-pattern': 2,                        // disallow use of empty destructuring patterns
    'no-eq-null': 2,                              // disallow comparisons to null without a type-checking operator
    'no-eval': 2,                                 // disallow use of eval()
    'no-extend-native': 2,                        // disallow adding to native types
    'no-extra-bind': 2,                           // disallow unnecessary function binding
    'no-extra-label': 2,                          // disallow unnecessary labels
    'no-fallthrough': 2,                          // disallow fallthrough of case statements
    'no-floating-decimal': 2,                     // disallow the use of leading or trailing decimal points in numeric literals
    'no-global-assign': 2,                        // disallow assignments to native objects or read-only global variables
    'no-implicit-coercion': 2,                    // disallow the type conversions with shorter notations
    'no-implicit-globals': 2,                     // disallow variable and function declarations in the global scope
    'no-implied-eval': 2,                         // disallow use of eval()-like methods
    'no-invalid-this': 2,                         // disallow this keywords outside of classes or class-like objects
    'no-iterator': 2,                             // disallow usage of __iterator__ property
    'no-labels': [2, {                            // disallow use of labeled statements
      'allowLoop': false,
      'allowSwitch': false
    }],
    'no-lone-blocks': 2,                          // disallow unnecessary nested blocks
    'no-loop-func': 2,                            // disallow creation of functions within loops
    'no-magic-numbers': 0,                        // disallow the use of magic numbers
    'no-multi-spaces': 2,                         // disallow use of multiple spaces
    'no-multi-str': 2,                            // disallow use of multiline strings
    'no-new-func': 2,                             // disallow use of new operator for Function object
    'no-new-wrappers': 2,                         // disallows creating new instances of String, Number, and Boolean
    'no-new': 2,                                  // disallow use of new operator when not part of the assignment or comparison
    'no-octal-escape': 2,                         // disallow use of octal escape sequences in string literals, such as var foo = 'Copyright \251';
    'no-octal': 2,                                // disallow use of octal literals
    'no-param-reassign': 2,                       // disallow reassignment of function parameters
    'no-proto': 2,                                // disallow usage of __proto__ property
    'no-redeclare': 2,                            // disallow declaring the same variable more then once
    'no-restricted-properties': 2,                // disallow certain properties on certain objects
    'no-return-assign': [2, 'always'],            // disallow use of assignment in return statement
    'no-script-url': 2,                           // disallow use of javascript: urls.
    'no-self-assign': 2,                          // disallow assignments where both sides are exactly the same
    'no-self-compare': 2,                         // disallow comparisons where both sides are exactly the same
    'no-sequences': 2,                            // disallow use of comma operator
    'no-throw-literal': 2,                        // restrict what can be thrown as an exception
    'no-unmodified-loop-condition': 2,            // disallow unmodified loop conditions
    'no-unused-expressions': 2,                   // disallow usage of expressions in statement position
    'no-unused-labels': 2,                        // disallow unused labels
    'no-useless-call': 2,                         // disallow unnecessary .call() and .apply()
    'no-useless-concat': 2,                       // disallow unnecessary concatenation of literals or template literals
    'no-useless-escape': 2,                       // disallow unnecessary escape characters
    'no-void': 2,                                 // disallow use of void operator
    'no-warning-comments': 1,                     // disallow usage of configurable warning terms in comments
    'no-with': 2,                                 // disallow use of the with statement
    'radix': 2,                                   // require use of the second argument for parseInt()
    'vars-on-top': 2,                             // requires to declare all vars on top of their containing scope
    'wrap-iife': 2,                               // require immediate function invocation to be wrapped in parentheses
    'yoda': 2,                                    // require or disallow Yoda conditions


    ////////// Strict Mode //////////

    'strict': [2, 'global'],                      // controls location of Use Strict Directives


    ////////// Variables //////////

    'init-declarations': [2, 'always'],           // enforce or disallow variable initializations at definition
    'no-catch-shadow': 2,                         // disallow the catch clause parameter name being the same as a variable in the outer scope
    'no-delete-var': 2,                           // disallow deletion of variables
    'no-label-var': 2,                            // disallow labels that share a name with a variable
    'no-restricted-globals': 2,                   // disallow specified global variables
    'no-shadow-restricted-names': 2,              // disallow shadowing of names such as arguments
    'no-shadow': [2, {                            // disallow declaration of variables already declared in the outer scope
      'builtinGlobals': true,
      'hoist': 'all'
    }],
    'no-undef-init': 2,                           // disallow use of undefined when initializing variables
    'no-undef': [2, { 'typeof': true }],          // disallow use of undeclared variables unless mentioned in a /*global */ block
    'no-undefined': 2,                            // disallow use of undefined variable
    'no-unused-vars': 2,                          // disallow declaration of variables that are not used in the code
    'no-use-before-define': 2,                    // disallow use of variables before they are defined


    ////////// Node.js and CommonJS //////////

    'callback-return': [0, [                      // enforce return after a callback
      'callback',
      'cb',
      'next',
      'resolve',
      'reject',
      'done']
    ],
    'global-require': 2,                          // enforce require() on top-level module scope
    'handle-callback-err': [2,                    // enforces error handling in callbacks  (on by default in the node environment)
      '^.*(e|E)rr$'
    ],
    'no-mixed-requires': 2,                       // disallow mixing regular variable and require declarations
    'no-new-require': 2,                          // disallow use of new operator with the require function
    'no-path-concat': 2,                          // disallow string concatenation with __dirname and __filename
    'no-process-env': 2,                          // disallow the use of process.env
    'no-process-exit': 2,                         // disallow process.exit() (on by default in the node environment)
    'no-restricted-modules': 0,                   // restrict usage of specified node modules
    'no-sync': 0,                                 // disallow use of synchronous methods


    ////////// Stylistic Issues //////////

    'array-bracket-spacing': [2, 'never', {       // enforce spacing inside array brackets (fixable)
      'singleValue': false,
      'arraysInArrays': true,
      'objectsInArrays': false
    }],
    'block-spacing': 2,                           // disallow or enforce spaces inside of single line blocks (fixable)
    'brace-style': 0,                             // enforce one true brace style
    'camelcase': 2,                               // require camel case names
    'comma-dangle': 2,                            // disallow trailing commas in object literals
    'comma-spacing': 2,                           // enforce spacing before and after comma
    'comma-style': 2,                             // enforce one true comma style
    'computed-property-spacing': 2,               // require or disallow padding inside computed properties (fixable)
    'consistent-this': [2, 'self'],               // enforces consistent naming when capturing the current execution context
    'eol-last': 2,                                // require or disallow newline at the end of files
    'func-call-spacing': [2, 'never'],            // require or disallow spacing between function identifiers and their invocations
    'func-name-matching': 2,                      // require function names to match the name of the variable or property to which they are assigned
    'func-names': 2,                              // require function expressions to have a name
    'func-style': 0,                              // enforces use of function declarations or expressions
    'id-blacklist': 2,                            // disallow specified identifiers
    'id-length': 0,                               // this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
    'id-match': 0,                                // require identifiers to match the provided regular expression
    'indent': [2, 2],                             // specify tab or space width for your code (fixable)
    'jsx-quotes': [2, "prefer-single"],           // specify whether double or single quotes should be used in JSX attributes
    'key-spacing': [2, {                          // enforces spacing between keys and values in object literal properties
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': [2, {                       // Enforce spacing before and after keywords
      'before': true,
      'after': false,
      'overrides': {
        'import': { 'after': true },
        'const': { 'after': true },
        'from': { 'after': true },
        'return': { 'after': true }
      }
    }],
    'line-comment-position': [2, 'above'],        // enforce position of line comments
    'linebreak-style': [2, 'unix'],               // disallow mixed 'LF' and 'CRLF' as linebreaks
    'lines-around-comment': [2, {                 // enforce empty lines around comments
      'beforeBlockComment': true,
      'beforeLineComment': true
    }],
    'lines-around-directive': 2,
    'max-depth': [2, 3],                          // specify the maximum depth that blocks can be nested
    'max-len': [2, 150, 4],                       // specify the maximum length of a line in your program
    'max-nested-callbacks': [2, 3],               // specify the maximum depth callbacks can be nested
    'max-params': [2, 4],                         // enforce a maximum number of parameters in function definitions
    'max-statements-per-line': [2, {              // enforce a maximum number of statements allowed per line
      'max': 1
    }],
    'max-statements': [2, 15],                    // enforce a maximum number of statements allowed in function blocks
    'multiline-ternary': [2, 'never'],            // enforce newlines between operands of ternary expressions
    'new-cap': 2,                                 // require a capital letter for constructors
    'new-parens': 2,                              // disallow the omission of parentheses when invoking a constructor with no arguments
    'newline-after-var': [2, 'always'],           // require or disallow an empty newline after variable declarations
    'newline-before-return': 2,                   // require an empty line before return statements
    'newline-per-chained-call': [2, {             // require a newline after each call in a method chain
      'ignoreChainWithDepth': 3
    }],
    'no-array-constructor': 2,                    // disallow use of the Array constructor
    'no-bitwise': 2,                              // disallow use of bitwise operators
    'no-continue': 2,                             // disallow use of the continue statement
    'no-inline-comments': 0,                      // disallow comments inline after code
    'no-lonely-if': 2,                            // disallow if as the only statement in an else block
    'no-mixed-operators': 2,                      // disallow mixed binary operators
    'no-mixed-spaces-and-tabs': [2,               // disallow mixed spaces and tabs for indentation
      'smart-tabs'
    ],
    'no-multiple-empty-lines': [2, {              // disallow multiple empty lines
      'max': 2,
      'maxEOF': 1
    }],
    'no-negated-condition': 2,                    // disallow negated conditions
    'no-nested-ternary': 2,                       // disallow nested ternary expressions
    'no-new-object': 2,                           // disallow use of the Object constructor
    'no-plusplus': [2, {                          // disallow use of unary operators, ++ and --
      'allowForLoopAfterthoughts': true
    }],
    'no-restricted-syntax': 2,                    // disallow use of certain syntax in code
    'no-tabs': 2,                                 // disallow tabs in file
    'no-ternary': 0,                              // disallow the use of ternary operators
    'no-trailing-spaces': [2, {                   // disallow trailing whitespace at the end of lines
      'skipBlankLines': true
    }],
    'no-underscore-dangle': 2,                    // disallow dangling underscores in identifiers
    'no-unneeded-ternary': 2,                     // disallow the use of ternary operators when a simpler alternative exists
    'no-whitespace-before-property': 2,           // disallow whitespace before properties
    'object-curly-newline':  [2, {                // enforce consistent line breaks inside braces
      'ObjectExpression': {
        'minProperties': 2
      },
      'ObjectPattern': 'never'
    }],
    'object-curly-spacing': [2, 'always', {       // require or disallow padding inside curly braces (fixable)
      'arraysInObjects': false,
      'objectsInObjects': false
    }],
    'object-property-newline': [2, {              // enforce placing object properties on separate lines
      'allowMultiplePropertiesPerLine': true
    }],
    'one-var': [2, 'never'],                      // allow just one var statement per function
    'operator-assignment': [2, 'always'],         // require assignment operator shorthand where possible or prohibit it entirely
    'operator-linebreak': [2, 'after'],           // enforce operators to be placed before or after line breaks
    'padded-blocks': [2, 'always'],               // enforce padding within blocks
    'quote-props': [2, 'as-needed'],              // require quotes around object literal property names
    'quotes': [2, 'single', 'avoid-escape'],      // specify whether double or single quotes should be used
    'require-jsdoc': [0, {                        // require JSDoc comment
      'require': {
        'FunctionDeclaration': true,
        'MethodDefinition': true,
        'ClassDeclaration': true
      }
    }],
    'semi-spacing': [2, {                         // enforce spacing before and after semicolons
      'before': false,
      'after': true
    }],
    'semi': [2, 'always'],                        // require or disallow use of semicolons instead of ASI
    'sort-keys': [0, 'asc', {                     // require object keys to be sorted
      'caseSensitive': true,
      'natural': false
    }],
    'sort-vars': 2,                               // sort variables within the same declaration block
    'space-before-blocks': [2, {                  // require or disallow space before blocks
      'functions': 'never',
      'keywords': 'never'
    }],
    'space-before-function-paren': [2, 'never'],  // require or disallow a space before function opening parenthesis (fixable)
    'space-in-parens': [2, 'never', {             // require or disallow spaces inside parentheses
      'exceptions': [
        '()'
      ]
    }],
    'space-infix-ops': 2,                         // require spaces around operators
    'space-unary-ops': 2,                         // require or disallow spaces before/after unary operators
    'spaced-comment': 0,                          // require or disallow a space immediately following the // or /* in a comment
    'unicode-bom': 2,                             // require or disallow Unicode byte order mark (BOM)
    'wrap-regex': 2,                              // require regex literals to be wrapped in parentheses


    ////////// ECMAScript 6 //////////

    'arrow-body-style': [2, 'as-needed'],         // require braces in arrow function body
    'arrow-parens': [2, 'as-needed', {            // require parens in arrow function arguments
      'requireForBlockBody': true
    }],
    'arrow-spacing': [2, {                        // require space before/after arrow function's arrow (fixable)
      'before': true,
      'after': true
    }],
    'constructor-super': 2,                       // verify calls of super() in constructors
    'generator-star-spacing': [2, {               // enforce spacing around the * in generator functions (fixable)
      'before': false,
      'after': true
    }],
    'no-class-assign': 2,                         // disallow modifying variables of class declarations
    'no-confusing-arrow': 2,                      // disallow arrow functions where a condition is expected
    'no-const-assign': 2,                         // disallow modifying variables that are declared using const
    'no-dupe-class-members': 2,                   // disallow duplicate name in class members
    'no-duplicate-imports': [2, {                 // disallow duplicate imports
      'includeExports': true
    }],
    'no-new-symbol': 2,                           // disallow new operators with the Symbol object
    'no-restricted-imports': 0,                   // disallow specified modules when loaded by import
    'no-this-before-super': 2,                    // disallow use of this/super before calling super() in constructors.
    'no-useless-computed-key': 2,                 // disallow unnecessary computed property keys in object literals
    'no-useless-constructor': 2,                  // disallow unnecessary constructors
    'no-useless-rename': [2, {                    // disallow renaming import, export, and destructured assignments to the same name
      'ignoreDestructuring': false,
      'ignoreImport': false,
      'ignoreExport': false
    }],
    'no-var': 2,                                  // require let or const instead of var
    'object-shorthand': [2, 'methods'],           // require method and property shorthand syntax for object literals
    'prefer-arrow-callback': 2,                   // suggest using arrow functions as callbacks
    'prefer-const': 2,                            // suggest using const declaration for variables that are never modified after declared
    'prefer-numeric-literals': 2,                 // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    'prefer-reflect': 0,                          // require Reflect methods where applicable
    'prefer-rest-params': 2,                      // require rest parameters instead of arguments
    'prefer-spread': 2,                           // suggest using the spread operator instead of .apply().
    'prefer-template': 2,                         // suggest using template literals instead of strings concatenation
    'require-yield': 2,                           // require generator functions to contain yield
    'rest-spread-spacing': [2, 'never'],          // enforce spacing between rest and spread operators and their expressions
    'sort-imports': 2,                            // enforce sorted import declarations within modules
    'symbol-description': 2,                      // require symbol descriptions
    'template-curly-spacing': 2,                  // require or disallow spacing around embedded expressions of template strings
    'yield-star-spacing': 2,                      // require or disallow spacing around the * in yield* expressions

    ////////// PLUGINS //////////

    // Eslint-plugin-babel
    'babel/new-cap': 2,
    'babel/object-curly-spacing': [2, 'always', {  // require or disallow padding inside curly braces (fixable)
      'arraysInObjects': false,
      'objectsInObjects': false
    }],
    'babel/no-await-in-loop': 0,

  }

};
