$(function() {
    var variantManager = new VariantsManager(variants).generateSelects();
});


function VariantsManager (variants) {
    var self = this;
    this.variants = variants;

    this.selectInputs = {};

    defaultVariants = [ "position",
                            "inventory_shipping_estimate",
                            "has_stock",
                            "weight",
                            "asin",
                            "product_id",
                            "inventory_policy",
                            "date_created",
                            "inventory_tracking",
                            "require_shipping",
                            "id",
                            "title",
                            "isbn",
                            "name",
                            "popularity",
                            "inventory_quantity",
                            "inventory_returnable",
                            "status",
                            "date_modified",
                            "taxable",
                            "sku",
                            "cost",
                            "compare_price",
                            "url",
                            "ean",
                            "discountable",
                            "thumbnail",
                            "price",
                            "inventory_minimum_quantity",
                            "images" ];

    this.updateVariants = function(value,text){
        console.log("CHANGE");
        self.removeOption("size", "S");
        self.newOption("size", "XS")
        //$('#variation-selector-size').minimalect('change');

    }

    this.buildOption = function( selectName, optionValue ){
        return $('<option>', {id: "variation-selector-"+selectName+"-"+optionValue, value: selectName+"="+optionValue, class: ""}).text(optionValue);
    }

    this.newOption = function( selectName, optionValue ){
        var value = selectName + "=" + optionValue;
        self.selectInputs[selectName].append( self.buildOption( selectName, optionValue ) );
    }

    this.removeOption = function(selectName, optionValue){
        var value = selectName + "=" + optionValue;
        self.selectInputs[selectName].children( "[value='"+value+"']" ).remove();

    }

    this.generateSelects = function(){
        var self = this;
        var selects = {};
        //var selectInputs = {};

        // Build selects object containing data of the variants select tags
        $.each( this.variants, function(index, value){
            $.each(value, function(index, value){
                if(defaultVariants.indexOf(index)<0){
                    if(! selects[index] ){
                        selects[index] = [value];
                    }else{
                        if(selects[index].indexOf(value)<0){
                            selects[index].push(value);
                        }
                    }
                }
            });
          });

        //Bluilding HTML Select elements
        $.each(selects, function(selectName, optionArray){
            
            var sel = $('<select>', {id: "variation-selector-"+selectName, value: selectName, name: selectName, class: "form-control"});
            $.each(optionArray, function(index, optionValue){
                sel.append( self.buildOption(selectName, optionValue) );
            });

            $('#variation-selector').append( $('<label>', {}).text(selectName) );
            $('#variation-selector').append(sel);

            sel.minimalect({
                'onchange': self.updateVariants,
                'live': true,
                'remove_empty_option': false,
                'debug': true
            });
            
            self.selectInputs[selectName] = sel;
        });
    }
}




// showProductVariation = function(selector) {

//     var parent          = selector.parentsUntil('.product').parent();
//     var variationsBlock = parent.parentsUntil('.variations').parent();
//     var selection       = selector.prop("selectedIndex");
//     var id              = selector.val();
//     var quantity        = parent.find('input').val();

//     variationsBlock.children('.product').each(function() {
//         $(this).hide();
//         $(this).find('input').each(function() {
//             $(this).val(0);
//         });
//         $(this).find('select').each(function() {
//             $(this).val(id);
//         });
//     });
//     $("#"+id).show();
//     $("#"+id).find('input').val(quantity);
// }


