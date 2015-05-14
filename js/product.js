$(function() {
    var variantManager = new VariantsManager(variants).init();
});


function VariantsManager (variants) {
    var self = this;
    this.variants = variants;

    this.selectsData = {};
    this.selectsInputs = {};
    this.selectValues = {};
    this.lastChangedValue = "";

    this.defaultVariants = [ "position",
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

    this.updateVariants = function(value, text, self){
        var self = this;

        selectName+"="+self.selectValues[selectName]

        var selectName = value.split("=")[0];

        if(value != this.lastChangedValue && value != selectName+"="+self.selectValues[selectName]){
            this.lastChangedValue = value;
            console.log("CHANGE:"+value);
            var filteredVariants = this.getFilteredVariants();
            console.log("filteredVariants");
            console.log(filteredVariants);
            var generatedSelects = this.generateSelectsData(filteredVariants);
            console.log("generatedSelects"); 
            console.log(generatedSelects); 
            this.buildSelectInputs(generatedSelects);
        }
    }

    this.updateSelectInputs = function(selectData){
        var self = this;
        //remove from select whats not in data

        //add in select whats in data
    }

    this.generateSelectsData = function(filteredVariants){
        var self = this;
        var selects = {};
        $.each( this.selectsData, function(index, value){
            selects[index] = [];
        });
        $.each( filteredVariants, function(index, value){
            $.each(value, function(index, value){
                if(self.defaultVariants.indexOf(index)<0){
                    if(selects[index].indexOf(value)<0){
                            selects[index].push(value);
                    }
                }
            });
          });

        return selects;
    }


    this.getFilteredVariants = function(){
        var filteredVariants = [];
        var self = this;
        //var selectValues = {};
        //retrieve selects values 
        $.each( self.selectsData, function(selectName, optionsArray){
            console.log("read select value: "+selectName);
            var selectValue = $("#variation-selector-"+selectName).val().split("=")[1];
            self.selectValues[selectName] = selectValue;
        });

        console.log("selectValues");
        console.log(self.selectValues);

        $.each( this.variants, function(index, variant){
            var passfilter = true;

            $.each( self.selectValues, function(selectName, selectValue){
                
                if(selectValue != ""){
                    if(variant[selectName]){
                        if(variant[selectName] != selectValue){
                            passfilter = false;
                        }
                    }else{
                        passfilter = false;
                    }
                }
            });

            if(passfilter) filteredVariants.push(variant);
        });
        return filteredVariants;
    }

    this.buildOption = function( selectName, optionValue, text ){
        return $('<option>', {id: "variation-selector-"+selectName+"-"+optionValue, value: selectName+"="+optionValue, class: ""}).text(text);
    }

    this.newOption = function( selectName, optionValue ){
        var value = selectName + "=" + optionValue;
        self.selectsData[selectName].append( self.buildOption( selectName, optionValue ) );
    }

    this.removeOption = function(selectName, optionValue){
        var value = selectName + "=" + optionValue;
        self.selectsData[selectName].children( "[value='"+value+"']" ).remove();
    }

    this.buildSelectInputs = function(selectData){
        var self = this;

        //empty field #variation-selector before
        
        $.each(selectData, function(selectName, optionArray){
            $('#variation-selector-'+selectName).minimalect("destroy");
        })
        $('#variation-selector').empty();

        $.each(selectData, function(selectName, optionArray){
            
            var sel = $('<select>', {id: "variation-selector-"+selectName, name: selectName, class: "form-control"});            
            sel.append( self.buildOption(selectName, "", "") );

            $.each(optionArray, function(index, optionValue){
                sel.append( self.buildOption(selectName, optionValue, optionValue) );
            });

            $('#variation-selector').append( $('<label>', {}).text(selectName) );
            $('#variation-selector').append(sel);



            sel.minimalect({
                'onchange': function(value,text){
                    self.updateVariants(value,text,self);
                },
                'live': true,
                'remove_empty_option': false,
                'debug': true,
                'placeholder': ""
            });
            
            console.log("set select value of "+selectName);
            console.log(selectName+"="+self.selectValues[selectName]);
            sel.val(selectName+"="+self.selectValues[selectName]);

            // if(self.lastChangedValue != ""){
            //     sel.val(self.lastChangedValue);
            // }
            
        });
    }

    this.init = function(){
        var self = this;
        var selects = {};

        // Build selects object containing data of the variants select tags

        $.each( this.variants, function(index, value){
            $.each(value, function(index, value){
                if(self.defaultVariants.indexOf(index)<0){
                    if(! self.selectsData[index] ){
                        self.selectsData[index] = [value];
                    }else{
                        if(self.selectsData[index].indexOf(value)<0){
                            self.selectsData[index].push(value);
                        }
                    }
                }
            });
          });

        //Init selectValues
        $.each( self.selectsData, function(index, value){
            self.selectValues[index] = "";
        });
        console.log("selectValues init");
        console.log(self.selectValues);

        //Bluilding HTML Select elements
        self.buildSelectInputs(self.selectsData);
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


