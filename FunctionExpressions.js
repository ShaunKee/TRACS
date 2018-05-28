1111/*  Modification Log

 *   05/12/2017   -   *** Important change to display
 *              -   Problem: Removing the Inactivate button caused the width of the data table to shrink for some model types.
 *              -   This was due to the inline style of display:block being added thru jQuery code after the table was successfully loaded.
 *              -   jQuery adds styles as inline attributes - removing the styles jQuery added will reset it to the original css styles.	
 *              -   Changed from:   $('#table_data').css('display', 'none');
 *              -   To: $('#table_data').removeAttr('style');
 *              -   This change was made to both this module and TRACS_Common.js
 *  30/01/2018  -   Project to remove evil eval
 *              -   var modelEval = "meta" + model;
 *              -   Changed var objModel = eval(modelEval); To
 *              -   var objModel = window[modelEval];
 *              -   Changed in some places but not all - still evaluating - no pun intended
 * 11/04/2018   -   Added section fpr handlebars demo
 * 23/05/2018   -   Major changes to Error Handling inline with changes to exception and messaging from the Web API controller methods
 *              -   Gradually replace all messaging code with a call to errorCallback()                
 */

executeFilteredSkipTake = function () {
    var uriFinal = "api/filters" + '/' + model + 's';  // Routed to filter controller method example - 'api/filters/locations'	  
    $.ajax({
        url: uriFinal + "?key=" + metaKey2,
        type: 'PUT',
        contentType: 'application/json;charset=utf-8',  // the type of data been sent to the server.
        data: JSON.stringify(objActiveFilters),
        dataType: "json",   // the type of data expected back from the server.
        beforeSend: setHeader,
        success: function (data, status, jqXHR) {
            returnedRecords = data.length;  // used in paging
            allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'            
            if (data.CustomErrorMessage) {
                alert(data.CustomErrorMessage.replace("</br>", "\n"));
                errorCallback(jqXHR, status, data.CustomErrorMessage,false,true);
            }
            else {
                var objModel = window["meta" + model];
                returnedRecords = data.length;  // used in paging
                allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'

                buildHeaderRow(objModel, "Standard");
                // Now build the table rows and cells for each returned model item
                for (var i = 0; i < data.length; i++) {
                    buildDataRow(data[i], objModel, "Standard");
                }

                // Bug Fix - disable the paging buttons for filtered results as all returned records are displayed.
                var $this = $('#btnPageNext');
                $this.attr('disabled', 'disabled').siblings('button').attr('disabled', 'disabled');                

                $('#frmPaged').reset;                
                $('.navbar-nav  > li > a, button, input,tr').removeClass('disabledControl');
                $('.loader').css('display', 'none');
                $('#table_data').removeAttr('style');

            }
        }
    }).fail(function (jqXHR, textStatus, err) {
        standardUpdate = false; detailsUpdate = false;
        errorCallback(jqXHR, textStatus, err, false, true);
    })
};

executeStandardSkipTake = function () {
    var urifinal = uriBaseConst + '/' + model + 's' + '/' + skipRecords + '/' + takeRecords;
    // Additional data sent with request ends up as querystring parameters ignored by routing, but used in message handling by ApiKeyHandler.
    $.getJSON(urifinal, "key=" + metaKey2)
        // On success, 'data' contains a list of records of the currently selected model e.g. Employee,CostCentre,Position
        .done(function (data, status, jqXHR) {

            if (data.CustomErrorMessage) {
                errorCallback(jqXHR, status, data.CustomErrorMessage);                
            }
            else {
                returnedRecords = data.length;  // used in paging
                allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'
                var maxId = jqXHR.getResponseHeader("X-Max-Id");    // Contains the maximum value of the Id's for the current model
                var objModel = window["meta" + model];
                buildHeaderRow(objModel, "Standard");

                for (var i = 0; i < data.length; i++) {
                    buildDataRow(data[i], objModel, "Standard");
                }

                formatRowsPagers();
                $('#frmPaged').reset;                
                $('.navbar-nav  > li > a, button, input,tr').removeClass('disabledControl');    // re-enable elements that shouldn't be operative during data retrieval.
                $('.loader').css('display', 'none');    // show datatable, hide loader
                $('#table_data').removeAttr('style');

                // Set attributes of the Id search field (allRecords is available here)
                for (var dbField in objModel) {
                    if (objModel[dbField].hasOwnProperty('Key')) {
                        dbAttrs = objModel[dbField];
                        if (dbAttrs.DBGen) {    // if identity key
                            var maxLength, maxValue;
                            maxId ? maxLength = maxId.length : maxLength = allRecords.length;
                            maxId ? maxValue = maxId : maxValue = allRecords;
                            $('#recordById').attr({
                                'type': 'number', 'required': 'true', 'size': maxLength, 'maxlength': maxLength, 'max': maxValue, 'min': 1
                            });
                        }
                        else {  // if not identity key
                            $('#recordById').attr({
                                'type': 'number', 'required': 'true', 'size': dbAttrs.MaxValue.length, 'max': dbAttrs.MaxValue, 'min': dbAttrs.MinValue
                            });
                        }
                        { break; }
                    }
                }
            }
        })
        .fail(function (jqXHR, textStatus, err) {
            errorCallback(jqXHR, textStatus, err);
        });

}