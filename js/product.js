$(function() {
    var variantManager = new VariantsManager(variants).init();
});


function VariantsManager (variants) {
    var self = this;
    this.variants = variants;
    this.realChange = false;

    this.selectsData = {};
    this.selectsUser = {};
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
        //var self = this;
        console.log("CHANGE");
        var selectName = value.split("=")[0];
        var selectValue = value.split("=")[1];

        if(value != this.lastChangedValue && self.realChange){
            console.log("self.realChange:"+self.realChange);
            this.lastChangedValue = value;
            self.selectsUser[selectName] = selectValue;

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

        //retrieve selects values 
        // $.each( self.selectsData, function(selectName, optionsArray){
        //     console.log("read select value: "+selectName);
        //     var selectValue = $("#variation-selector-"+selectName).val().split("=")[1];
        //     self.selectValues[selectName] = selectValue;
        // });

        // console.log("selectValues");
        // console.log(self.selectValues);

        $.each( this.variants, function(index, variant){
            var passfilter = true;

            $.each( self.selectsUser, function(selectName, selectValue){
                
                if(selectValue != ""){
                    if(variant[selectName]){
                        if(variant[selectName] != selectValue){
                            passfilter = false;
                        }
                    }else{
                        console.log("ERROR: variant: "+variant.name +" doesn't have attribute: "+selectName);
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
        self.realChange = false;

        //empty field #variation-selector before
        
        $.each(selectData, function(selectName, optionArray){
            $('#variation-selector-'+selectName).minimalect("destroy");
        })
        $('#variation-selector').empty();

        $.each(selectData, function(selectName, optionArray){
            
            var sel = $('<select>', {id: "variation-selector-"+selectName, name: selectName, class: "form-control"});            
            //sel.append( self.buildOption(selectName, "", "") );

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
                'placeholder': null
            });

            // if(self.selectsUser[selectName]){
            //     if(selectData[selectName].indexOf(self.selectsUser[selectName]) > -1){
            //         sel.val(selectName+"="+self.selectsUser[selectName]);
            //     }else{
            //         sel.val(selectName+"="+selectData[selectName][0]);
            //     }
            // }else{
            //     sel.val(selectName+"="+selectData[selectName][0]);
            // }
            // $("#variation-selector-size").val("size=M");


            // sel.val(selectName+"="+self.selectValues[selectName]);

            // if(self.lastChangedValue != ""){
            //     sel.val(self.lastChangedValue);
            // }
            
        });

        self.realChange = true;
    }

    this.init = function(){
        var self = this;

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
        console.log("self.selectsData");
        console.log(self.selectsData);

        //Init selectValues
        // $.each( self.selectsData, function(index, value){
        //     self.selectsUser[index] = self.selectsData[index][0];
        // });
        // console.log("self.selectsUser init");
        // console.log(self.selectsUser);

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


