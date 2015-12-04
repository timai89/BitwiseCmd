// Expression View

app.compose(function () {
    "use strict";


    var formatter = app.get('formatter');
    var calc = app.get('calc');
    var html = app.get('html');
    var cmdConfig = app.get('cmdConfig');
    var expression = app.get('expression');

    // TODO: move to protojs
    String.prototype.padLeft = function(size, char) { return formatter.padLeft(this, size, char); }

    app.modelView(app.models.BitwiseExpressionViewModel, {
        renderView: function(model) {
            var template = app.template('bitwiseExpressionView');
            return colorizeBits(template.render(model));
        }
    });

    app.modelView(app.models.BitwiseNumbersViewModel, {
        renderView: function(model) {
            model.bitsSize = getBinaryLength(model.numbers);
            return colorizeBits(app.template('numbersList').render(model));
        }
    });

    app.modelView(app.models.ViewResult, {
        renderView: function(model) {
            var template = app.template(model.template);
            return template.render();
        }
    });

    app.modelView(app.models.ErrorResult, {
        renderView: function(model) {
            return html.element('<div class="error">{message}</div>', model);
        }
    });

    app.modelView(app.models.DisplayResult, {
        renderView: function(model) {
            var resultView = app.template('resultView').render(model);
            var contentView = app.buildViewFor(model.content);
            resultView.querySelector('.content').appendChild(contentView);
            return resultView;
        }
    });

    function getBinaryLength(arr) {
        var bits = calc.maxNumberOfBits(arr);
        if(cmdConfig.emphasizeBytes && bits % 8 != 0) {
            if(bits < 8) {
                return 8;
            }

            var n = bits - (bits % 8);
            return n + 8;
        }
        return bits;
    }

    function colorizeBits(container) {
        var list = container.querySelectorAll('.bin');
        Array.prototype.forEach.call(list, function(el){
            var bin = el.textContent;

            if(cmdConfig.emphasizeBytes) {
                bin = bin.replace(/(\d{8})/g, '<span class="byte">$1</span>');
            }

            el.innerHTML = bin
                .replace(/0/g, '<span class="zero">0</span>')
                .replace(/1/g, '<span class="one">1</span>');
        });
        return container;
    }

    function getResultMode(operands) {
        for(var i=0; i<operands.length; i++) {
            if(operands[i] != null && operands[i].kind == 'hex') {
                return 'hex';
            }
        }

        return 'dec';
    }
});
