/* global __needy */
// Modify the needy instance that required this file.
if (typeof __needy !== 'undefined')
{
    var CoffeeScript = require('coffee-script');

    // In my tests the require wasn't actually returning CoffeeScript. This may
    // be a config issue on my part. Try falling back to the global
    // CoffeeScript.
    if (!CoffeeScript.compile) {
        CoffeeScript = window.CoffeeScript;
    }

    if (!CoffeeScript || !CoffeeScript.compile) {
        throw new Error("Unable to load CoffeeScript");
    }
    __needy.addInitializer('coffee', function(module, source, dirname, needy, global) {
        var compiled, opts;

        opts = {
            sourceMap: true,
            header: true,
            inline: true,
            sourceFiles: [ module.id ],
            generatedFile: module.id
        };
        try {
            compiled = CoffeeScript.compile(source, opts);
        } catch (err) {
            err.message = "In " + module.id + ", " + err.message;
            throw err;
        }
        source = compiled.js;

        if (window.btoa) {
            source += '\n//# sourceMappingURL=data:application/json;base64,' +
                window.btoa(compiled.v3SourceMap || '');
        }

        __needy.defaultInitializers.js(module, source, dirname, needy, global);
    });
}
