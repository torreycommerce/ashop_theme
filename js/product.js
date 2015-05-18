$(function() {
    //var variantManager = new VariantsManager(variants).init();
    this.variantManager2 = new VariantsManager2(variants).init();
});

function updateVariants (selectName, optionValue){
    console.log("UPDATE");
}



function VariantsManager2 (variants) {
    var self = this;
    this.variants = variants;
    this.realChange = false;
    this.product_id = this.variants[0].product_id;
    this.selector = "[id=variation-selector-"+this.product_id+"]";

    this.filteringValue = "size";

    this.selectsData = {};
    this.selectedValues = {};
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

    this.getVariationSelector = function(selectName, optionValue){
        return "[id=variation-selector-"+selectName+"-"+optionValue+"]";
    }


    this.updateVariants = function(selectName, optionValue){
        var self = this;
        self.selectedValues[selectName] = optionValue;
        $.each(self.selectsData, function(name, optionArray){
            var selectedValues2 = {};

            $.each(self.selectsData, function(name2, optionArray2){
                if(name2 != name){
                    if(self.selectedValues[name2]){
                        selectedValues2[name2] = self.selectedValues[name2];
                    }
                }
            });

            var filteredVariants = self.getFilteredVariants(selectedValues2);

            var generatedSelectsData = self.generateSelectsData(filteredVariants);

            $.each(optionArray, function(index, value){

                if(generatedSelectsData[name].indexOf(value) < 0){
                    if(self.selectedValues[name] == value){
                        //Selected, not available
                        //$(self.getVariationSelector(name, value)).attr("style", "color:#4EC67F; border: solid #FF0000;");
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                    }else{
                        //not selected not available
                        //$(self.getVariationSelector(name, value)).attr("style", "color:#34495E; border: solid #FF0000;");
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable");
                    }
                }else{
                    if(self.selectedValues[name] == value){
                        //Selected, available
                        //$(self.getVariationSelector(name, value)).attr("style", "color:#4EC67F; border: solid #0000FF;");
                        $(self.getVariationSelector(name, value)).attr("class", "selected");
                    }else{
                        //not Selected available
                        $(self.getVariationSelector(name, value)).attr("class", "");
                    }
                }
            });

        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 1){
            $.each(self.variants, function(index, variant){
                var id = "product-" + variant.id;
                if(variant.id == filteredVariants[0].id){
                    $("#"+id).show();
                }else{
                    $("#"+id).hide();
                }
            });
        }else if(filteredVariants.length == 1) {
            console.log("UNAVAILABLE");
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

    this.getFilteredVariants = function(selectedValues){
        var filteredVariants = [];
        var self = this;

        $.each( this.variants, function(index, variant){
            var passfilter = true;

            $.each( selectedValues, function(selectName, selectValue){
                
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

    this.destroySelectInputs = function(selectData){
        $.each(selectData, function(selectName, optionArray){
            $('[id=variation-selector-'+selectName+']').minimalect("destroy");
        })
        $(self.selector).empty();
    }

    this.getATag = function(selectName, optionValue){
        var self = this;
        return tag =  $('<a>', {id: "variation-selector-"+selectName+"-"+optionValue, class: ""}).text(optionValue).click(function(){
            self.updateVariants(selectName, optionValue);
        });
    }

    this.buildChips = function(selectData){
        var self = this;
        console.log("selectData");
        console.log(selectData);

        $.each(selectData, function(selectName, optionArray){
            //var selectSelector = "[id=variation-selector-"+selectName+"]";
            
            var div = $('<div>', {id: "variation-selector-"+selectName, name: selectName, class: "size-details"});           
            var ul = $('<ul>', {class: "swatches-size Size"});  
            var span = $('<span>', {class: "selected-size"}).append(
                            $('<strong>', {}).text(selectName) 
                        );

            $.each(optionArray, function(index, optionValue){
                ul.append( 
                    $('<li>', {class: ""}).append(
                            self.getATag(selectName, optionValue)
                    )  
                );
            });

            div.append(span);
            div.append(ul);

            $(self.selector).append(div);
            
        });
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

        //Bluilding HTML Select elements
        self.buildChips(self.selectsData);
    }
}


// function VariantsManager (variants) {
//     var self = this;
//     this.variants = variants;
//     this.realChange = false;
//     this.product_id = this.variants[0].product_id;
//     this.selector = "[id=variation-selector-"+this.product_id+"]";

//     this.filteringValue = "size";

//     this.selectsData = {};
//     this.selectsUser = {};
//     this.lastChangedValue = "";

//     this.defaultVariants = [ "position",
//                             "inventory_shipping_estimate",
//                             "has_stock",
//                             "weight",
//                             "asin",
//                             "product_id",
//                             "inventory_policy",
//                             "date_created",
//                             "inventory_tracking",
//                             "require_shipping",
//                             "id",
//                             "title",
//                             "isbn",
//                             "name",
//                             "popularity",
//                             "inventory_quantity",
//                             "inventory_returnable",
//                             "status",
//                             "date_modified",
//                             "taxable",
//                             "sku",
//                             "cost",
//                             "compare_price",
//                             "url",
//                             "ean",
//                             "discountable",
//                             "thumbnail",
//                             "price",
//                             "inventory_minimum_quantity",
//                             "images" ];

//     this.updateVariants = function(value, text, self){
//         //var self = this;
//         console.log("CHANGE");
//         var selectName = value.split("=")[0];
//         var selectValue = value.split("=")[1];

//         if(value != this.lastChangedValue && self.realChange){

//             this.lastChangedValue = value;
//             if(selectName = self.filteringValue){
//                 self.selectsUser[selectName] = selectValue;
//             }
            
//             var filteredVariants = this.getFilteredVariants();
//             var generatedSelects = this.generateSelectsData(filteredVariants);
//             self.destroySelectInputs(generatedSelects);
//             if(filteredVariants.length == 1){

//                 $.each(self.variants, function(index, variant){
//                     var id = "product-" + variant.id;
//                     if(variant.id == filteredVariants[0].id){
//                         $("#"+id).show();
//                     }else{
//                         $("#"+id).hide();
//                     }
//                 });

//                 self.buildSelectInputs(generatedSelects);
//             }

//         }
//     }

//     this.updateSelectInputs = function(selectData){
//         var self = this;
//         //remove from select whats not in data

//         //add in select whats in data
//     }

//     this.generateSelectsData = function(filteredVariants){
//         var self = this;
//         var selects = {};
//         $.each( this.selectsData, function(index, value){
//             selects[index] = [];
//         });
//         $.each( filteredVariants, function(index, value){
//             $.each(value, function(index, value){
//                 if(self.defaultVariants.indexOf(index)<0){
//                     if(selects[index].indexOf(value)<0){
//                             selects[index].push(value);
//                     }
//                 }
//             });
//           });

//         return selects;
//     }


//     this.getFilteredVariants = function(){
//         var filteredVariants = [];
//         var self = this;

//         $.each( this.variants, function(index, variant){
//             var passfilter = true;

//             $.each( self.selectsUser, function(selectName, selectValue){
                
//                 if(selectValue != ""){
//                     if(variant[selectName]){
//                         if(variant[selectName] != selectValue){
//                             passfilter = false;
//                         }
//                     }else{
//                         console.log("ERROR: variant: "+variant.name +" doesn't have attribute: "+selectName);
//                         passfilter = false;
//                     }
//                 }
//             });

//             if(passfilter) filteredVariants.push(variant);
//         });
//         return filteredVariants;
//     }

//     this.buildOption = function( selectName, optionValue, text ){
//         return $('<option>', {id: "variation-selector-"+selectName+"-"+optionValue, value: selectName+"="+optionValue, class: ""}).text(text);
//     }

//     this.newOption = function( selectName, optionValue ){
//         var value = selectName + "=" + optionValue;
//         self.selectsData[selectName].append( self.buildOption( selectName, optionValue ) );
//     }

//     this.removeOption = function(selectName, optionValue){
//         var value = selectName + "=" + optionValue;
//         self.selectsData[selectName].children( "[value='"+value+"']" ).remove();
//     }

//     this.destroySelectInputs = function(selectData){
//         $.each(selectData, function(selectName, optionArray){
//             $('[id=variation-selector-'+selectName+']').minimalect("destroy");
//         })
//         $(self.selector).empty();
//     }

//     this.buildSelectInputs = function(selectData){
//         var self = this;
//         self.realChange = false;

//         $.each(selectData, function(selectName, optionArray){

//             var selectSelector = "[id=variation-selector-"+selectName+"]";
            
//             var sel = $('<select>', {id: "variation-selector-"+selectName, name: selectName, class: "form-control"});            
//             //sel.append( self.buildOption(selectName, "", "") );

//             $.each(optionArray, function(index, optionValue){
//                 sel.append( self.buildOption(selectName, optionValue, optionValue) );
//             });

//             $(self.selector).append( $('<label>', {}).text(selectName) );
//             $(self.selector).append(sel);

//             $(selectSelector).minimalect({
//                 'onchange': function(value,text){
//                     self.updateVariants(value,text,self);
//                 },
//                 'live': true,
//                 'remove_empty_option': false,
//                 'debug': true,
//                 'placeholder': null
//             });
            
//         });

//         self.realChange = true;
//     }

//     this.init = function(){
//         var self = this;

//         // Build selects object containing data of the variants select tags
//         $.each( this.variants, function(index, value){
//             $.each(value, function(index, value){
//                 if(self.defaultVariants.indexOf(index)<0){
//                     if(! self.selectsData[index] ){
//                         self.selectsData[index] = [value];
//                     }else{
//                         if(self.selectsData[index].indexOf(value)<0){
//                             self.selectsData[index].push(value);
//                         }
//                     }
//                 }
//             });
//         }); 
//         console.log("self.selectsData");
//         console.log(self.selectsData);

//         //Bluilding HTML Select elements
//         self.buildSelectInputs(self.selectsData);
//     }
// }

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

