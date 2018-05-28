/// <reference path="TRACS_Common.js" />

//#region Mod Log
/* Modification Log
 *  4/4/2017    -   If this is development highlight the Hunter New England Health banner in green
 *  5/4/2017    -   If this is development default the login credentials and simulate a login button click event
 *  19/4/2017   -   Added :not pseudo class to row double click script to exclude reports rows
 *  01/05/2017  -   When adding or removing audit doco, update the finalised flag accordingly
 *  12/05/2017  -   Disable Login buttons during login process
 *              -   Highlight the Audit type in blue.
 *              -   Set background of MTM modal grey to further highlight messaging
 *              -   Remove automatic focus of date fields on update and insert models - was annoying to users
 *  15/05/2016  -   Code block to allow/deny permission to add evidence at the major Audit level.
 *  16/05/2016  -   determineModelAssociations - header row on MTM modal was adding more header columns than required. It was trying to account for paging.
 *                  Monitored fix at this stage to gauge the effect on other screens 
 *  17/05/2017  -   Removed table-curved class on details display of MTM modal 
 *              -   Function - $(document.body).on("click", "#tbody_data_mm .show-children", function () {...}
 *              -   var $detDT = $('<table>', {'class': "table table-striped table-condensed table-hover".... 
 *  17/05/2017  -   On the build of the Insert Modal, if boolean field and not for display, set a default value of false.
 *              -   e.g. MTM_added and Active field of Audit measure
 *  17/05/2017  -   Removed Inactivate button and header column from display of Details screen
 *              -   Lines 354,706
 *  22/05/2017  -   The name of the current model was being lost on return from managing MTM assessment functions
                -   On entering a page for a model, the name of the model is stored in a data attribute on the btnFindAll button
                -   Extract the stored model name when performing View All, View Paged, find by Id and name
 *  24/05/2017  -   Moved some functions and comments for clarity
 *              -   For evidence add and remove operations, disabled the Update button until successful completion.
 *  25/05/2017  -   BuildDataRow() - Place fields marked with a PrimaryPositionAttribute in the model after the row counter field
 *  29/05/2017  -   Modified BuildUpdateModal() and BuildInsertModal() so fields marked with a PrimaryPositionAttribute in the model are positioned after Id field 
 *  29/05/2017  -   Changed longhand counter = counter + 1 to shorthand form counter++
 *  29/05/2017  -   Bug Fix - boolean non-display fields were being set to true incorrectly in BuildInsertModal() - throwing Reports out. 
 *  31/05/2017  -   Changed Complete(AME's) and Finalised(Audit) flag to literal string "true" or "false" from "1" or "0"
 *              -   Was failing to validate the model in the update controller. 
 *  31/05/2017  -   Moving toward removal of abbreviated name - trial of concatenating audit_name rather than abbreviated name in fileInputChange()
 *  02/06/2017  -   buildDetailsModalMM() - Added code to pick up the year of the parent audit for display on the title of the MTM modal.
 *  02/06/2017  -   Removed global variable uriMetaData
 *  02/06/2017  -   Created a global variable for $btnFindAll instead of a local variable each time the model changes - this stores the parent model name in a data attribute
 *  08/06/2017  -   Changed takeRecordsConst and takeRecords from 5 to 10
 *  14/06/2017  -   Removal of abbreviated name from file operations - buildDataRow(),buildUpdateModal(),fileInputChange()
 *              -   Abbreviated name has been moved to Lookup_Audit_Type - if problems encountered will revisit using this property
 *  14/06/2017  -   Added tooltip to display the abbreviated name if this is the Audit Type model - buildDataRow()
 *  20/06/2017  -   Removed $btnInactive from details row build buildDataRow()
 *  21/06/2017  -   Built a generic event handler for menu item clicks and moved to TRACS_Common.js
 *              -   $(document.body).on("click", '.nav.navbar-nav .dropdown-menu li a', function () {....}
 *              -   There was previously a separate handler for each menu item in the html file
 *              -   Attributes for #recordById are now set in skipTakeObjects().
 * 26/06/2017   -   Made dbAttrs a local variable in buildDataRow(),buildUpdateModal(),buildInsertModal()
 * 26/06/2017   -   Code block in  buildDataRow() to set attributes of Id search field based on properties of the current model's key field.
 *              -   ?Identity key or otherwise, min value, max value, size etc
 * 27/06/2017   -   Add defaultPosition returned from login controller to session variable.
 * 28/06/2017   -   skipTakeObjects() - Added maxLength,maxValue to control the size, max value and max length of the 'search by id' field for Identity based models
 *              -   Has a corresponding change in the controller method to add the max value of Id's for the current model to the response headers 
 * 29/06/2017   -   Fix issue with creating generic click event for menu items. This was still trying to call a controller method based on the href and failing.
 *              -   Set an Id property for these items and make corresponding change to generic click event to exit the function if Id exists.
 * 07/07/17     -   Various improvements in BuildDataRow() - rownum++ and creation of $tr
 * 16/08/2017   -   Added a speed parameter to the show() and hide() methods when showing/hiding child rows
 * 28/08/2017   -   Added gblStickyFilter to the global variables. This is only set in Filtering.js.
 *              -   Run either standard SkipTake or Filtering to return records to the main datatable
 * 29/08/2017   -   Coincidental change to sticky filters
 *              -   Change $.each loops to for...loops - faster * 2
 * 19/09/2017   -   Minor change - $('#entityLabel') prefixed with 'Page Title' instead of 'Page'
 * 26/10/2017   -   Above change caused an issue when selecting 'Manage Audit Management Task' as concatenating it with 'Page Title' tipped it over
 *              -   the 40 character limit the PadRight() routine was expecting. Reverted to just 'Page'
 * 23/11/2017   -   Trial of Fancy Functions being added as a menu item on the navbar.
 *              -   Changes to TRACS_Audits.html and $(document.body).on("click", '.nav.navbar-nav .dropdown-menu li a' 
 * 29/11/2017   -   Took out comments in SkipTakeObjects()
 *              -   Removed uriBase as a variable and any references to it.
 * 05/12/2017   -   Removed Inactivate Button from end of each row - will revisit later
 * 05/12/2017   -   *** Important change to display
 *              -   Problem: Removing the Inactivate button caused the width of the data table to shrink for some model types.
 *              -   This was due to the inline style of display:block being added thru jQuery code after the table was loaded.
 *              -   jquery adds style as inline attributes - removing the styles jQuery added will reset it to the original css styles.	
 *              -   Changed from:   $('#table_data').css('display', 'none');
 *              -   To: $('#table_data').removeAttr('style');
 *              -   This change was made to both this module and FunctionExpressions.js
 * 06/12/2017   -   Project to allow the addition of audit measures from a button at the end of the row. *  
                    The Method:
                    1.	An extra button ( + Add Audit Measure) has been added to the end of any rows with a mtm relationship, where the row is the parent in the relationship. 
                        This has been added to determineModelAssociations().
                    2.	Added a click event on the new button which calls existing module buildUpdateModal()
                        a.	Strategy is to populate the fields of the update modal with corresponding fields from the current row, thereby eliminating data entry and the potential for error. 
                        b.	Leave the key field blank which will simulate an insert in the web api controller.
                        c.	Update to this module to remove setting the key field on the modal for this record 
                    3.	Slight change to treatment of boolean fields in UpdateRecord() and the insert of a new Audit Measure works as expected.
                        13/12/2017   -   buildUpdateModal() - added audit key value as data attribute to be used in updateRecord().
                    4.  22/12/2017 - determineModelAssociations() 
                        Removed code that built the 'Add Audit Measure' button.
                    5.  Added routine in BuildUpdateModal to limit the list of Audit Measure Task based on the compliance area as the current Audit
                        Only called while building the update modal for adding an audit measure to an audit.
 * 18/12/2017   - minor change to green highlighting of logo when region is development - $(document.body).on("click", "#btnLogin",function () {...}
 * 12/01/2017   - isPathWay variable in UpdateRecord() was previously set to a boolean object with a new constructor.
 *              - This was later being evaluated incorrectly later
 *              - Var is now initialised to primitive boolean false.
 * 12/01/2018   - Moved appRegion out of the global name space 
 * 15/01/2018   - buildDataRow() - Hack for Audit Measure rows only - display finalised field according to AMA's completion status....only here for records where Finalised has not been set properly in the d/b.
                  This should happen when doco has been entered for all AMA's under an Audit Measure.
                  Corresponding project underway to set the finalised flag properly after completion of the last assessment for the audit measure.
 * 23/01/2018   - Addition to comments only 
 * 24/01/2018   - Remove above temporary hack for Audit Measure rows.....Audit Measures are now updated to completed when all child assessments have doco uploaded.
 * 30/01/2018   - Added 'var' keyword to definition of modalEval in several spots - avoids polluting global space
 * 30/01/2018   - Project to remove evil eval
 *              - var modelEval = "meta" + model;
 *              - Changed var objModel = eval(modelEval); To
 *              - var objModel = window[modelEval];
 *              - Changed in some places but not all - still evaluating
 * 31/01/2018   - Changed code at end of BuildUpdateModal() that added the 'key field is disabled' string.
 *              - It was being unintentionally being added to the registration form as well.
 * 08/02/2018   - In Web API, the Audit Measures now have their finalised flag set to true when the last assessment has been completed for that Audit Measure.
 *              - Removed code in buildDataRow() that trawled through assessments to see if all had been completed before setting the finalised flag.
 *              - The flag is now set based on completion status of Audit Measures. Previous code archived. 
 * 08/02/2018   - Global variable $btnFindAll removed, now declared as a var in each model that uses it. 
 * 14/02/2018   - Code added to allow creation of a user from the admin menu on Foundations.html
 *                      else if ($href.left(7) == "#Create") {    // The Create User menu item under Admin has been selected
                        $('a[href = "#Users"]').click();
                        $('#btnAddRec').click();
                        return;
* 14/02/2018   - Code to support Authorisation Project
*               - Added different error module code to loadFTObjects() to cater for addition of role based authorisation on controllers                            
* 15/02/2018    - Added a facility to allow the user to change their password, once they are logged in.
*               - $(document.body).on("click", ".changePassword", function (e) {....}
*               - $(document.body).on("click", "#btnChangePassword", function () {....}
* 21/02/2018    - Took out dblclick on table rows.
*               - Previously opened in edit mode, but was not carrying foward data attributes. 
* 17/04/2018    - Added routine in BuildUpdateModal to limit the list of Audt Measure Task based on the compliance area as the current Audit
*               - Only called while while building the update modal for adding an audit measure to an audit.
* 20/04/2018    - Change to position relative to input field
* 26/04/2018    - Added an event listener for a click event on the update button of the update modal    -   $(document.body).on("click", "#modalUp", function()..... 
*               - Changed from calling updateRecord() from form action in html.  
*               - Corresponding change in html to have void form action on submit.
* 02/05/2017    - Project to cater for insert of model types with natural keys
*               - Was previously just udating the record in place, even if it already existed, thereby overwriting the current record
*               - Plan is to inform the user that a record already exists for the Id
*               - Various changes in update/add button click handlers to set data fields on update/insert button of update modal
*               - Changes in updateRecord() to read data attributes and process accordingly 
*               - Corresponding changes in Employees controller - added post method for types with natural keys 
*               - Corresponding changes in model for types that have a natural key - Employee, User, Cost Centre 
* 03/05/2018    - Various mods and deletes to comments 
*               - Moved timer method on date/time display from $.ready to IIFE
* 03/05/2018    - Various changes to remove evil eval()  
* 07/05/2018    - Distinguish between the webserver directory missing and the TRACS target directory missing when processing the error.
*               - Corresponding changes in exception handling of the file upload controller.
* 08/05/2018    - Major Issue - previously allowed to remove evidence for an Audit Measure Assessment that is the child of an Audit that has already been finalised.
*               - It does not make sense to be able to do that as it would make the finalised status of the Audit invalid.
*               - Some alerting change to error routine for file removal. Most of the changes have been completed in the file upload controller.
* 23/05/2018    - Major changes to Error Handling inline with changes to exception and messaging from the Web API controller methods
*               - Gradually replace all messaging code with a call to errorCallback()                
*/
//#endregion Mod Log

//#region Globals
var urlFinal,
    uriBaseConst = "api/employees",
    model = "",
    metaAssociations = {},      // 1*% - meta data for EF model objects
    metaAudit = { name: "Audit" },
    metaAudit_Type = { name: "Audit_Type" },
    metaAudit_Interval = { name: "Audit_Interval" },
    metaAudit_Measure = { name: "Audit_Measure" },
    metaAudit_Measure_Assessment = { name: "Audit_Measure_Assessment" },
    metaAudit_Standard = { name: "Audit_Standard" },
    metaAudit_Measure_Task = { name: "Audit_Measure_Task" },
    metaAudit_Measure_Type = { name: "Audit_Measure_Type" },
    metaCampus = { name: "Campus" },
    metaCompliance_Area = { name: "Compliance_Area" },
    metaCompliance_Type = { name: "Compliance_Type" },
    metaCostCentre = { name: "CostCentre" },
    metaEmployee = { name: "Employee" },
    metaLocation = { name: "Location" },
    metaLocation_Type = { name: "Location_Type" },
    metaPosition = { name: "Position" },
    metaUser = { name: "User" },
    metaRole = { name: "Role" },
    metaSector = { name: "Sector" },
    metaEvent_Log = { name: "Event_Log" },
    skipRecords = 0,
    takeRecordsConst = 10,
    takeRecords = 10,
    returnedRecords = 0,
    allRecords = 0,
    // 2*% - create model objects for foreign key tables for use in dropdowns - uses object literal syntax
    Employee = { name: "Employee" },                // Initialise object with the 'name' property.
    Title = { name: "Title" },                      // Iuxta
    CostCentre = { name: "CostCentre" },            // Ditto
    Position = { name: "Position" },                // As well as
    User = { name: "User" },                        // So on and so forth
    Role = { name: "Role" },                        // To infinity and beyond
    Location_Type = { name: "Location_Type" },      // tanto como
    Location = { name: "Location" },                // ebenso
    Location_Map = [],                              // ad infinitum
    Campus = { name: "Campus" },
    Sector = { name: "Sector" },
    Campus_Map = [],
    Compliance_Area = { name: "Compliance_Area" },
    Compliance_Type = { name: "Compliance_Type" },
    Audit = { name: "Audit" },
    Audit_Type = { name: "Audit_Type" },
    Audit_Standard = { name: "Audit_Standard" },
    Audit_Interval = { name: "Audit_Interval" },
    Audit_Measure_Type = { name: "Audit_Measure_Type" },
    Audit_Measure_Task = { name: "Audit_Measure_Task" },
    Audit_Measure = { name: "Audit_Measure" },
    rowNum = 0,
    arrObjects = [],
    blnLgnSuccess = false,
    metaKey2,
    upDateBool,  // Used to keep track of skip/take settings after update;
    detailsUpdate = false,
    standardUpdate = false,
    userNameX, computerNameX, onLoginModal = false,
    $updatedRow,
    hostURL,
    killBill = true,
    Idle_Timeout = 900,    // in seconds = 15 minutes
    _idleSecondsCounter = 0,
    gblStickyFilter = false;  // this is only set in filtering.js
//#endregion Globals

(function () {

    // Add a left() function to JavaScript's built-in String prototype so all other strings will inherit it:
    String.prototype.left = function (n) {
        return this.substring(0, n);
    };
    String.prototype.padRight = function (l, c) { return this + Array(l - this.length + 1).join(c || " ") };
    // this routine sourced here http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
    //String.prototype.capitalize = function () {
    //    return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
    //};

    // Code block to test for idle time.
        document.onclick = function () {
            _idleSecondsCounter = 0;
        };
        document.onmousemove = function () {
            _idleSecondsCounter = 0;
        };
        document.onkeypress = function () {
            _idleSecondsCounter = 0;
        };
        intervalID = window.setInterval(CheckIdleTime, 1000);  // check idle time every second

        function CheckIdleTime() {
            _idleSecondsCounter = _idleSecondsCounter + 1;  // corresponds with checking idle time every second
            if (_idleSecondsCounter >= Idle_Timeout) {
                sessionStorage.removeItem("lgnSuccess"); // if timing out, remove the session storage item that flags previous successful login i.e. force user to log back in.
                var path = window.location.pathname;
                var page = path.split("/").pop();
                var siteTemp = path.split(page)[0];
                var site = siteTemp.replace(new RegExp("/", "g"), "");
                // kill the server security code for the session - forces the user to log back in.
                // this call is handled in both HTTP pipeline on the server by MessageHandlers.cs and a controller method. 
                $.ajax({
                    url: 'api/employees/killBill/' + "?" + $.param({
                        "key": "killBill"
                    }),
                    type: 'GET',
                    success: function (data, status, jqXHR) {
                        clearInterval(intervalID);
                        document.location.href = hostURL + site + "/" + "Index.html";
                    }
                }).fail(function (jqXHR, textStatus, err) {
                    errorCallback(jqXHR, textStatus, err, true);
                })
            }
        }
    // End Code block to test for idle time.

    // Code to display time on a set interval.
        var d = new Date();
        var t = d.toLocaleTimeString();
        document.getElementById("time").innerHTML = t;
        var timer = setInterval(function () { runTimer() }, 10000);
        function runTimer() {
            var dt = new Date();
            var tm = dt.toLocaleTimeString();
            document.getElementById("time").innerHTML = tm;
        }
})();

$(window).unload(function () {

    // the unLoad() event is sent to the window whenever the user navigates away from the page.
    // the variable killBill is set to false when the refresh routine is called. 

    if (killBill) {
        // kill the server security code for the session - forces the user to log back in.
        // this call is handled in both the HTTP pipeline on the server by MessageHandlers.cs and a Web API controller method. 
        $.ajax({
            url: 'api/employees/killBill/' + "?" + $.param({
                "key": "killBill"
            }),
            type: 'GET',
            success: function (data, status, jqXHR) {
                killBill = false;
            }
        }).fail(function (jqXHR, textStatus, err) {
            errorCallback(jqXHR, textStatus, err, true);
        });
    }

});

$(document).ready(function () {

    // block of code to disable the back button on the browser
        window.location.hash = "no-back-button";
        window.location.hash = "Again-No-back-button";//again because google chrome doesn't insert first hash into history
        window.onhashchange = function () { window.location.hash = "no-back-button"; }
    // end disable back button

    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;
    var obj = $('#scrResolutionLabel').text("Viewport Width: " + viewportWidth + " Viewport height: " + viewportHeight + "\nResolution W: " + window.screen.availWidth + " Resolution H: " + window.screen.availHeight);
    obj.html(obj.html().replace(/\n/g, '<br/>'));

    login();    // placing login() here ensures that the login modal is loaded, but only once. 
});

function login() {

    try {
        var ax = new ActiveXObject("WScript.Network");
        userNameX = ax.UserName;
        computerNameX = ax.ComputerName;
        $('#lgnUserName').val(userNameX);  // login defaults        
    }
    catch (e) {
        var allgood = "handled";
    }

    $('.navbar-nav  > li > a, button, input, tr').addClass('disabledControl');  // Disable elements that shouldn't be operative during data retrieval.
    $('#modalLogin *').removeClass('disabledControl');      // Immediately remove disabled class for controls on the login modal

    // Code block to control logging in and process after idle timeout
    var http = location.protocol;
    var slashes = http.concat("//");
    hostURL = slashes.concat(window.location.host).concat("/");

    var isDev = false;
    if (hostURL.search("localhost") >= 0 || hostURL.search("wdhcaren006") >= 0) isDev = true;

    if (sessionStorage.lgnSuccess) { // the user is already logged in
        metaKey2 = sessionStorage.beetle;
        $('#btnPagePrev').attr('disabled', 'disabled');

        var appRegion = sessionStorage.appRegion ? sessionStorage.appRegion : "";
        $('#appRegion').html("<span>Application Region - </span>&nbsp;&nbsp;" + appRegion);

        // Simulate click event on menu item to make sure the hover effect on the dropdown is activated
        if (model == "Audit") {
            $('a[href="#Audits"]').click();
        }
        else if (model == "Employee") {
            $('a[href = "#Employees"]').click();
        }
    }
    else { // the user is not logged in
        sessionStorage.setItem("lgnAttempts", 0);
        onLoginModal = true;        // informs shown.bs.modal that this is the login modal being shown to allow focus to be set on the password field. 
        //$('#modalLogin').modal({ backdrop: 'static', keyboard: false });
        if (isDev && userNameX && computerNameX) {
            if (userNameX == "50013135" && computerNameX == "WDHCAREN006") {
                //$('#lgnPassword').val("utsd4_26");  // default for development box - doesn't show login modal, simulates a click on the login button
                $('#lgnPassword').val("bottle");  // default for development box - doesn't show login modal, simulates a click on the login button
                $('#btnLogin').click();
            }
        }
        else if (isDev) {
            $('#lgnUserName').val("50013135");
            $('#lgnPassword').val("bottle");
            $('#btnLogin').click();
        }
        else {
            $('#modalLogin').modal({ backdrop: 'static', keyboard: false });
        }
    }
}

function skipTakeObjects() {
    
    $('.navbar-nav  > li > a, button, input, tr').addClass('disabledControl');  // disable elements that shouldn't be operative during data retrieval.
    cleanUp();
    $('.loader').css('display', 'flex');        // show loader, hide datatable
    $('#table_data').css('display', 'none');

    if (gblStickyFilter) {
        executeFilteredSkipTake(); // execute sticky filters function expression - declared in FunctionExpression.js.
    } else {
        executeStandardSkipTake();
    }
}

function updateRecord() {

    // Code block - sets a boolean flag to indicate whether this update is from a pathway update e.g. adding an Audit Measure from the Audit row.
    var $btnUpdate;
    $btnUpdate = $("#modalUp");
    var $pathwayParent = "";        // coerces to boolean false
    var $pathway = "";              // ditto
    var $parentId;
    var isPathWay = false;  // 12/01/2018
    var isNaturalKeyInSert = false;     // 02/05/2018
    var isInsert = false;       // 21/05/2018

    if ($btnUpdate.data && $btnUpdate.data("pathway")) {
        $pathwayParent = $btnUpdate.attr('data-parent');
        $pathway = $btnUpdate.attr('data-pathway');
        $parentId = $btnUpdate.attr('data-parentid');
        isPathWay = true;
    }
    else if ($btnUpdate.data && $btnUpdate.data("natural-key")) {
        isNaturalKeyInSert = true;
    }
    // End code block

    // This routine is for both insert and update

    // show loader, hide datatable
    $('.loader').css('display', 'flex');
    $('.table').css('display', 'none');

    // 'model' gives us the current type - set when a main tab is selected
    var modelEval = "meta" + model,
         objModel = window[modelEval],      // eval(modelEval)  -   Changed 03/05/2018
         dbIdentity = false;

    // fill with input field values from the form on the update modal
    var Row_Id;
    var objForUpdate = {};  // will contain new values for model and will be serialised for update to database
    for (var field in objModel) {

        // set a flag if this is an identity field
        if (objModel[field].hasOwnProperty('DBGen')) {
            if (objModel[field]['DBGen']) {
                dbIdentity = true;
            }
        }

        var targetInput = '#up' + field;  // input fields on the form have an id prefixed with 'up'        

        //objForUpdate[field] = $(targetInput).val();  // value of field passed by the modal
        // 06/12/2017 - Changed from simple update above to cater for mtm inserts from a parent row e.g. creating a new Audit_Measure from a Audit row
        //            - Previously,some boolean fields were not being populated properly 
        if (objModel[field].PropType === "Boolean") {
            if ($(targetInput).val() == "") {
                objForUpdate[field] = 0;
            } else {
                objForUpdate[field] = $(targetInput).val();  // value of field passed by the modal
            }
        }
        else {
            objForUpdate[field] = $(targetInput).val();     // value of field passed by the modal
        }

        $val = $(targetInput).val();

        // Values are set in the checkboxes, if checked the value is set to "1", else it is set to "0"
        if (objModel[field].ForDisplay && objModel[field].PropType === "Boolean") {   // Values are set in the checkboxes, if checked the value is set to "1", else it is set to "0"
            if (objForUpdate[field] === "1" || objForUpdate[field] === "true") {
                objForUpdate[field] = 1;    // for boolean fields: 0 = false, 1 = true in Db
            }
            else { objForUpdate[field] = 0; }
        }

        // For identity fields on insert, set a default value - accepted by web api controller, but ignored in database update
        if (dbIdentity && $(targetInput).val() === "") {
            // 0 is sent in identity key field for new records because no record will have an identity value of zero, which forces web api controller AddOrUpdate to add a new record. 
            objForUpdate[field] = 0;
            isInsert = true;        // Informs the controller this is an insert operation
        }
        if (objModel[field].hasOwnProperty('Key')) {
            Row_Id = $(targetInput).val();
        }

        if (objModel[field].hasOwnProperty('DataType')) {
            // See blurb about UTC date treatment at bottom of code
            if (objModel[field].DataType === "Date") {
                var frmDateInput = $(targetInput).val().toString();
                var frmDate = frmDateInput.trim();
                var jsDate = moment(frmDate, "DD/MM/YYYY");
                // the UI allows an empty string in some dates, which would evaluate to jsDate.isValid=false.
                // This is incorrect for dates allowed to be null, so only check validity for dates not allowed to be null i.e. frmDate exists.
                if (frmDate && !jsDate.isValid()) {
                    errorCallback("Not Ajax", "An invalid date was entered in " + field.replace(new RegExp("_", "g"), " "), "Invalid Date");
                    $(targetInput).after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");
                    return;
                }
                else {
                    objForUpdate[field] = moment.utc(frmDate, "DD/MM/YYYY").toDate();
                }
            }
            else if (objModel[field].DataType === "Password" && $val === "") {
                objForUpdate[field] = "createuser";     // Provide initial value for password when creating a user, otherwise Model Validation fails in the controller.
            }
        }
        dbIdentity = false;
    }

    var DTO = JSON.stringify(objForUpdate);
    var uriFinal = uriBaseConst + "/" + model.toLowerCase();

    $.ajax({
        url: uriFinal +  "?" +  $.param({ "key": metaKey2, "Operation": isInsert? "Insert" : "Update" }),
        //url: uriFinal + "?key=" + metaKey2,
        type: isNaturalKeyInSert ? 'POST' : 'PUT',
        contentType: 'application/json;charset=utf-8',  // the type of data been sent to the server.
        data: DTO,
        dataType: "json",   // the type of data expected back from the server.
        beforeSend: setHeader,
        success: function (data, status, jqXHR) {

            var databaseOperation = jqXHR.getResponseHeader("X-Database-Operation");    // set in method OnActionExecuted for action filter ActionEditActionFilter on the controller.
            if (isNaturalKeyInSert && data.CustomErrorMessage) {
                $("#modalDismiss").click();
                alert(data.CustomErrorMessage);
                errorCallback(jqXHR, status, data.CustomErrorMessage.replace(new RegExp('\\n', "g"), '</br>'));
            }
            else
            {
                allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // see PutAudit_Measure() controller method for new way of adding record count. Also returns the record added/updated
                rowNum = skipRecords;
                upDateBool = true;  // used to keep track of skip/take settings after update
                $("#modalDismiss").click();
                if (!detailsUpdate) {
                    //#region Add Audit Measure to Audit
                        // If this is a pathway update and the model being added is Audit Measure, then we also need to add audit measure assessments
                        // This is to be replaced by web api controller code that will be transaction based.
                        if (isPathWay && model == 'Audit_Measure') {  // make more generic later on                    
                            var uriFinal = uriBaseConst + '/' + "details" + '/' + "audit_measures" + '/' + $parentId + '/' + data["Audit_Measure_Id"];
                            $.ajax({
                                url: uriFinal + "?key=" + metaKey2,
                                type: 'POST',
                                contentType: 'application/json;charset=utf-8',
                                dataType: "json",
                                beforeSend: setHeader,
                                success: function (data, jqXHR) {
                                    errorCallback(jqXHR, status, data.CustomErrorMessage ? data.CustomErrorMessage : databaseOperation);
                                }
                            }).fail(function (jqXHR, textStatus, err) {
                                errorCallback(jqXHR, textStatus, err);
                            });
                        }
                    //#endregion

                    // Is this coming from a mtm pathway update e.g. add an Audit Measure from main screen Audit row.
                    // If so, set the model to the mtm child's parent.
                    var tabModel = "";
                    if (isPathWay == true) {
                        model = $pathwayParent;
                    }                    
                    tabModel = "a[href='#" + model + "s']";                    
                    $(tabModel).click();    // click event on the appropriate menu item                
                    loadFTObjects(window[model]);   // loadFTObjects(eval(model)); - Changed 03/05/2018 
                    $updatedRow = "tr[id='" + Row_Id + "']";
                    errorCallback(jqXHR, status, data.CustomErrorMessage? data.CustomErrorMessage: databaseOperation);
                } else {
                    var $parent_id = $("#modalUp").attr('data-parent_id');
                    var $btnSelector = '#' + $parent_id + "." + "show-children";
                    var $parentToClick = $($btnSelector);
                    errorCallback(jqXHR, status, data.CustomErrorMessage ? data.CustomErrorMessage : databaseOperation, true);
                }
            }
        }
    }).fail(function (jqXHR, textStatus, err) {
        if (textStatus == "error") {
            $("[id^='modalDismiss']").click();
        }
        standardUpdate = true;
        errorCallback(jqXHR, textStatus, err, false);
    });
}

function buildUpdateModal($tr) {

    var $id = $($tr).attr('id');
    $("#modalUp").prop("disabled", false);      // may have previously been set to disabled in the file handler routine

    var $model, $name, $location, $type, $auditDate, $assessment_due_date, $compArea, $campus, $parentAuditName, $parent_id, $btnUpdate, $finalised;

    if ($tr.data && $tr.data("model")) {
        $model = $tr.data("model");
        model = $model;
        // group of data attrs for use in file upload handler
        $name = $tr.data("name");                       // set in buildDataRow for all models with a name field -  - should be all models
        $location = $tr.data("location");               // set in buildDataRow for models with a location field.
        $type = $tr.data("audit-type");                 // set in buildDataRow for all models.
        $auditDate = $tr.data("audit-date");            // set in buildDataRow for models with a due date field.       
        $compArea = $tr.data("compliance-area");        // set in buildDataRow for models with a due date field.
        $campus = $tr.data("campus");                   // set in buildDataRow for models with a campus field.
        $parentAuditName = $tr.data("parent-audit-name");                   // set in buildDataRow for models with a parent audit name field.        
        $parent_id = $($tr).attr('data-parent_id');
        $btnUpdate = $("#modalUp");
        $btnUpdate.attr('data-parent_id', $parent_id);
        $assessment_due_date = $tr.data("assessment-due-date");
        $finalised = $tr.data("finalised");
    }

    $("#divUpdate").empty();

    // regex string manipulation - finds each occurance of a lower case character followed by an upper case character, and inserts a space between them
    // Update the modal text with a combination of plain text and appended span tags, so they can be styled separatley - see h4 entry in TRACS.css
    var modelText = model.replace(/([a-z])([A-Z])/g, '$1 $2');
    var nameText = $name ? $name : "";
    var $locSpan = $('<span/>', { text: $location ? $location : "" });
    var $nameSpan = $('<span/>', { text: nameText ? nameText : "" });

    $("#ModalTitle").text("Update " + modelText.replace(new RegExp("_", "g"), " ")).append($locSpan).append($nameSpan);  // caption on update modal

    var lblText, inputId, $labelFor, $inputFor, $docoAnchor, $docoUploadFor, $docoRemove, $newP, objModel = {};

    var dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldRE = false, dbFieldEM = false, dbFieldDT = false, dbFieldRng = false, dbFieldDS = false, dispField = true, dbFieldColl = false, dbFieldKey = false, dbIdentity = false, dbBoolDisplay = false, dbRequired = true,
       validationRegEx, validationErrMsg, validationPlcHolder, validationType, validationMin, validationMax, validationSize, validationMaxLgth, dbAttrs = {};

    var modelEval = "meta" + model;
    var objModel = window[modelEval];

    for (var dbField in objModel) {

        dbAttrs = objModel[dbField];    // dbAttrs contains the code first annotations for the current field in the current model

        inputId = dbField;

        dbFieldFT = objModel[dbField].hasOwnProperty('ForeignTbl'); //  Is this db field a foreign lookup table in the model, such as CostCentre and Title in Employee
        dbFieldFK = objModel[dbField].hasOwnProperty('ForeignKey'); // Is this db field a foreign key field in the model, such as cost_centre_id
        dbFieldTS = objModel[dbField].hasOwnProperty('Timestamp'); // Is this db field a time stamp field in the model
        dbFieldRE = objModel[dbField].hasOwnProperty('RegularExpression'); // Does this db field have a regular expression annotation in the model
        dbFieldEM = objModel[dbField].hasOwnProperty('ErrMsg'); // Does this db field have an error message annotation in the model
        dbFieldDT = objModel[dbField].hasOwnProperty('DataType'); // Does this db field have a data type annotation in the model
        dbFieldRng = objModel[dbField].hasOwnProperty('MinValue'); // Does this db field have a Min Value - only range expressions have a min value.
        dbFieldSize = objModel[dbField].hasOwnProperty('StringLength'); // Does this db field have a string length attribute
        dbFieldDS = objModel[dbField].hasOwnProperty('Display'); // Does this db field have a string length attribute
        dbFieldKey = objModel[dbField].hasOwnProperty('Key');

        $newP = $("<p></p>");

        inputId = dbField;
        // Rows of the table are built in BuildDataRow with an id = property name in the model.
        var $value = $($tr).children('td[id="' + dbField + '"]').text();    // value of corresponding cell (same Id) in row being edited       

        dbAttrs.Display ? lblText = dbAttrs.Display.replace(new RegExp("_", "g"), " ") : lblText = "";

        $labelFor = $('<label>', {
            html: lblText
        });

        // setup a placeholder field based on the property type of the current field
        if (dbAttrs.PropType === "Int32") {
            validationPlcHolder = "0...9";
        }
        else if (dbAttrs.PropType === "String") {
            validationPlcHolder = "Aa..Zz";
        }
        else if (dbAttrs.PropType === "Collection") {
            dbFieldColl = true;
        }
        else if (dbAttrs.PropType === "Boolean") {
            dbBoolDisplay = true;
        }

        // if this is a foreign table collection or name property, move to the next item in the for...each loop
        if (dbFieldColl || dbField === "name") {
            { continue; }
        }

        if (dbAttrs.PropType.search(/nullable/i) >= 0) {    // case insensitive search for nullable field type which drives the HTML5 required field.
            dbRequired = false;
        }

        // Handle fields with a datatype
        if (dbFieldDT) {
            if (dbAttrs.DataType === "Email") {
                validationType = 'email'; // HTML5 performs validation
                validationPlcHolder = "some.one@hnehealth.nsw.gov.au";
                validationSize = "50";
            }
            else if (dbAttrs.DataType === "Date") {
                // regular expressions are normally set in the model, but modelbinder expects the date in the ISO 8601 format, YYYY/MM/DDT00:00:00Z
                // the date entered here in dd/mm/yyyy format is converted to ISO 8601 format in updateRecord()
                // So the reg ex cannot be set in the model, as it would work for the front-end to enter in dd/mm/yyyy, and then fail the modelbinder test in the api controller
                validationPlcHolder = "DD/MM/YY";
                validationRegEx = "(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}";
                validationErrMsg = "Value must be a date in the format DD/MM/YYYY";
            }
        }

        if (dbFieldEM) {
            validationErrMsg = dbAttrs.ErrMsg;
        }

        if (dbFieldRE) {
            validationRegEx = dbAttrs.RegularExpression;
            validationErrMsg = dbAttrs.RegExMSG;
        }

        if (dbFieldRng) {
            validationType = 'number';
            validationMin = dbAttrs.MinValue;
            validationMax = dbAttrs.MaxValue;
            validationMaxLgth = validationMax.length;
            validationSize = validationMaxLgth;
        }

        if (dbFieldSize) {
            validationSize = dbAttrs.StringLength;
            validationMaxLgth = dbAttrs.StringLength;
        }

        dispField = dbAttrs.ForDisplay;

        if (!dbFieldFT) {   // if this field is not a foreign key field in the model, build the input field

            //#region Build the input field for non Foreign Key fields

            // regular fields have a 'ForDisplay' boolean attribute of true on the model - If this is a regular field build the input field.
            // If this is a non-regular field create a hidden input field and set the label to hidden e.g. timestamp, active, one of the fk fields e.g. cost_centre_id 
            if (dispField) {
                if (!dbBoolDisplay) {
                    $inputFor = $('<input/>').attr({
                        'type': validationType,
                        'id': 'up' + dbField,
                        'placeholder': validationPlcHolder,
                        'title': validationErrMsg,          // overridden by default HTML 5 messaging
                        'size': validationSize,             // display size of input field
                        'maxlength': validationMaxLgth,     // maximum number of input chars allowed
                        'pattern': validationRegEx,
                        'class': 'form-control',
                        'required': true,
                        'min': validationMin,
                        'max': validationMax
                    });
                    $inputFor.val($value);

                    if (!dbRequired) {
                        $inputFor.removeAttr("required");    // for nullable fields, remove the required attribute - essentially saying required='false' but that syntax doesn't work
                    }

                    // TRACS fudge to disable user entry of documentation date - this is set by TRACS server
                    if (dbField.search(/document/i) >= 0) {
                        $inputFor.prop("disabled", true);
                    }

                    // Doco code
                    if (dbAttrs.DataType === "Upload") {
                        // this routine applies to documentation fields
                        $value = $($tr).children('td[id="' + dbField + '"]').html();
                        // $value is picked up from the datarow as an anchor element, complete with class and span tag for tool tip
                        $docoAnchor = $($value);
                        //if ($value !== "No Evidence") {
                        if (!$docoAnchor.hasClass("disabledControl")) {     // The absence of this class means the anchor element relates to a record with evidence
                            $docoAnchor.attr("id", 'upLoadAnchor' + $id);   // for later update in the file upload handler
                            var $href = $docoAnchor.prop('href');
                            $href = decodeURIComponent($docoAnchor.prop('href')).replace("file:", "");       // JS function decodeURIComponent employed to remove %20 from href                           
                            $href = $href.replace(sessionStorage.baseShareLoc, "");
                            $value = $href;      // $value for $inputFor ( to be updated in d/b) is the stripped down href file path
                        } else {
                            // These are records without evidence
                            $value = "No Evidence";
                            // Create a disabled documentation anchor which is later updated and shown in the file upload handler 
                            $docoAnchor.attr("id", 'upLoadAnchor' + $id);
                        }

                        if (!$finalised) {
                            $span = $docoAnchor.find("span:first").remove();    // remove the span element (with glyphicons) in favour of an I element that can have font-awesome icons added.
                            $FontAwesomeI = $('<i/>', {
                                class: "fa fa-thumbs-down",
                                'style': 'color:red;font-size:24px',
                            });
                            $docoAnchor.append($FontAwesomeI);
                        }

                        $inputFor = $('<input>', {
                            'id': 'up' + dbField
                        });
                        $inputFor.attr({ 'hidden': 'true' });
                        $inputFor.val($value);

                        // build an upload documentation input field of type 'file' and add an event listener to it.
                        $docoUploadFor = document.createElement('input');
                        $docoUploadFor.type = "file";
                        $docoUploadFor.className += "btn btn-default btn-file uploadDoco";                        
                        $finalised ? $docoUploadFor.style.visibility = 'visible' : $docoUploadFor.style.visibility = 'hidden';
                        $docoUploadFor.id = 'upDoco';
                        // Setup the attributes in an object and iterate the keys of the object to set the associated attribute                        
                        var opt = {
                            'data-audit-location': $location, 'data-audit-type': $type, 'multiple': 'multiple', 'accept': 'application/pdf', 'data-audit-model': $model,
                            'data-audit-id': $id, 'data-audit-name': $name, 'data-audit-date': $auditDate, 'data-assessment-due-date': $assessment_due_date,
                            'data-audit-compliance-area': $compArea, 'data-audit-campus': $campus, 'data-audit-parent-audit-name': $parentAuditName, 'data-audit-inputid': 'up' + dbField
                        };
                        Object.keys(opt).forEach(function (key) { $docoUploadFor.setAttribute(key, opt[key]); });
                        $docoUploadFor.addEventListener('change', fileInputChange, false);  // function fileInputChange handles the doco upload

                        // build a remove documentation button and add an event listener to it.
                        $docoRemove = document.createElement('button');
                        $docoRemove.type = "button";
                        $docoRemove.id = 'upDocoRemove';
                        $docoRemove.innerHTML = "Remove";  // text on the button face
                        $docoRemove.className += "btn btn-sm btn-info btn-shadow doco";
                        var $hrefRemove = decodeURIComponent($docoAnchor.prop('href')).replace("file:", "");
                        $docoRemove.setAttribute('data-audit-inputid', 'up' + dbField);
                        $docoRemove.setAttribute('data-removalFilePath', $hrefRemove);  // filepath to the doco to be removed
                        $docoRemove.setAttribute('data-audit-id', $id);  // id of the current audit                        
                        $docoRemove.addEventListener('click', fileRemoval, false);  // function fileRemoval handles the doco removal
                        $value === "No Evidence" ? $docoRemove.classList.add("disabledControl") : $docoRemove.classList.remove("disabledControl");
                        $value === "No Evidence" ? $docoRemove.style.visibility = 'hidden' : $docoRemove.style.visibility = 'visible';
                        $finalised ? $docoRemove.style.visibility = 'visible' : $docoRemove.style.visibility = 'hidden';
                    }
                    // End Doco code

                    // attach jQuery-UI datepicker to date input fields
                    if (dbFieldDT) {
                        if (dbAttrs.DataType === "Date") {
                            var now = new Date();
                            var nowYear = now.getFullYear();
                            minYear = nowYear - 1;
                            maxYear = nowYear + 1;
                            var minDate = new Date(minYear, 0, 1);      // JavaScript counts months from 0 to 11. January is 0. December is 11.
                            var maxDate = new Date(maxYear, 11, 31);
                            $inputFor.datepicker({
                                dateFormat: 'dd/mm/yy',
                                numberOfMonths: [2, 2],
                                minDate: minDate,
                                maxDate: maxDate,
                                showOn: "both",
                                showOtherMonths: true,
                                showOtherYears: true,
                                changeMonth: true,
                                changeYear: true,
                                yearRange: "-1:+1",
                                onSelect: function (selectedDate) {
                                    $(this).change();   // datepicker doesn't automatically fire the onChange evvent, so manually fire it to remove the red asterix for invalid entry                               
                                    var $inputs = $(this).closest('form').find(':input.hasDatepicker'); // all inputs on the form with the datepicker class
                                    var $nextInput = $inputs.eq($inputs.index(this) + 1); //var cnt = $inputs.length; var indy = $inputs.index(this); $nextInput.focus(); 
                                    $nextInput.focus();
                                },
                                beforeShow: function (input, inst) {    // controls placement of the datepicker
                                    var htOffset = input.offsetHeight - 30; // 20/4/2018 - Change to position relative to input field
                                    inst.dpDiv.css({ marginTop: htOffset + 'px', marginLeft: (input.offsetWidth + 10) + 'px' });
                                }
                            });
                            //  For new pathway to add audit measures from the current audit row.
                            //  Set the anniversary date to a year before the due date
                            if ($tr.data("pathway") && $tr.data("pathway").left(10) == "Adding mtm" && dbField == "Audit_Measure_Anniversary_Date") {
                                $("#modalUp").attr('data-parent', $tr.data("parent"));  // Adds parent to the Insert button, in this case the parent is 'Audit'
                                $("#modalUp").attr('data-pathway', $tr.data("pathway"));  // Adds pathway to the Insert button
                                var id = $tr.data("parentid");
                                $("#modalUp").attr('data-parentId', $tr.data("parentid"));  // Adds pathway to the Insert button
                                var auditDateInput = $('#upAudit_Due_Date').val().toString();   // value of due date
                                var auditDate = auditDateInput.trim();
                                var jsDate = moment(auditDate, "DD/MM/YYYY");   // convert to a moment
                                var auditAnnivDateInput = jsDate.subtract('years', 1);  // subtract a year.
                                $value = moment(auditAnnivDateInput).format("DD/MM/YYYY");  // fromat to dd/mm/yyyy
                                $inputFor.val($value);
                            }
                        }
                    }
                }
                else {  // BOOLEAN display field e.g. Finalised
                    // Create a checkbox with the initial checked property and value set.
                    // Changes to the checkbox are handled in the delgated event handler $("#frmUpdate").on("change", "input[type=checkbox]",.....

                    $inputFor = $('<input/>').attr({
                        'type': 'checkbox',
                        'id': 'up' + dbField,
                        'class': 'form-control'
                    });

                    if ($value === 'Yes') {
                        $inputFor.prop('checked', true);
                        $inputFor.val("1");
                    }
                    else {
                        $inputFor.prop('checked', false);
                        $inputFor.val("0");
                    }
                    $inputFor.prop('disabled', true);
                }
            }
            else {
                $labelFor.attr({ 'hidden': 'true' });
                $inputFor = $('<input/>').attr({ type: 'input', 'id': 'up' + dbField, 'value': $value, 'hidden': 'true' });
                if (dbFieldFK) {   // If this is a foreign key field, change it's Id
                    modalFK_Id = 'modalFK_Id' + dbField;
                    $inputFor.attr({ 'id': modalFK_Id });
                }
            }
            if (dbFieldKey) {       // Set input field to disabled if its key field
                $inputFor.prop({ "disabled": true }).css("font-weight", "Bold");
            }
        }
        // #endregion
        else {

            //#region Build select elements for foreign key fields with options set to the foreign key values

            fkKey = dbField + "_Id";        // name of corresponding fk field
            fkVal = $($tr).children('td[id="' + fkKey + '"]').text();
            $inputFor = $('<select/>').attr({
                'type': 'input',
                'id': 'up' + fkKey,
                'required': 'true',
                'class': 'form-control'
            });

            $inputFor.css('min-width', '40%');  // Set the minimum width of the select box with respect to the modal screen
            var $selectOption = $('<option/>').attr({ 'value': '' }).text(' Please Select  ');   // add initial option. Note the hack: the space at beginning is deliberate for later sorting of options
            $inputFor.append($selectOption);

            var acArray = [];   // for autocomplete - the source option for autocomplete requires an array, not an object
            var objFT = {};
            var objColl = window[dbField];  // var objColl = eval(dbField); objColl is now a collection of the foreign table - uses evil eval.

            //#region Limit dropdown options for Audit Measure Task
            // Aim is to limit the number of Audit Measure Tasks based on the Compliance Area of the parent Audit.
            // Code is based on changing the object that is supplied to the routine that builds the select options
            // Note: The synchronous Ajax call has to be rewritten to handle asynchronous - synchronous calls maybe going away and are considered bad practice.
            //       Have to investigate promises, as this is what an Ajax call returns
            if (dbField == "Audit_Measure_Task") {
                var ajaxFail = false;
                var $parentComplianceArea = $($tr).children('td[id=Compliance_Area_Id]').text();    // lifted from parent audit row
                var $parentAudit = $($tr).children('td[id=Audit_Id]').text()
                var objCollClone = jQuery.extend(true, {}, objColl);   // creates a deep copy/clone of objColl that is a seperate object and can be updated independently
                var url = "api/compliances/audit_measure_tasks/" + $parentComplianceArea + "/" + $parentAudit + "?key=" + metaKey2;
                callSynchronousAjax(url).then(function (data) {
                    if (data.CustomErrorMessage) {  // an application type error has occurred   -   error message routine has been called in callSynchronousAjax
                        alert(data.CustomErrorMessage);
                        ajaxFail = true;
                    } else {
                        Object.keys(objCollClone).forEach(function (key) {
                            if (data.indexOf(key) == -1) delete objCollClone[key]   // if the FT object key is not in the set returned, delete the key
                        });
                        objFT = objCollClone;
                        $('#modalUpdate').modal({ backdrop: 'static', keyboard: false });   // show the modal if all is good.                        
                    }
                }).fail(function () {
                    alert("An unexpected error has occurred");
                    ajaxFail = true;    // an unexpected error has occurred - error message routine has been called in callSynchronousAjax
                });
                if (ajaxFail) {
                    return;     // returns to button click handler if AJAX call fails - no need to build rest of the update modal. 
                }
            }
            else {
                cleanUp();
                objFT = objColl;
            }
            //#endregion

            // Build the select options from the FT collection 
            for (var collField in objFT) {   // remove name property of collection from the select options
                if (objFT[collField] !== objFT.name) {
                    $selectOption = $('<option/>').attr({ 'value': collField }).text(objFT[collField]);
                    $inputFor.append($selectOption);
                    acArray.push(objFT[collField]);    // for trial of autocomplete - fill array with option text
                }
            }

            // This borrowed routine is to sort the FT options by text rather than value - by default, the FT object is sorted by value rather then text
            var options = $("option", $inputFor);
            var arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value }; }).get();
            arr.sort(function (o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
            options.each(function (i, o) {
                o.value = arr[i].v;
                $(o).text(arr[i].t);
            });

            $inputFor.autocomplete({ source: acArray });     // for autocomplete - the source option (mandatory) requires an array, not an object

            // Some foreign table collection fields are for display only e.g. Audit_Measure in Audit_Measure_Assessment
            // If not for display only, override the input and label fields.
            if (!dispField) {
                $inputFor = $('<label>', {
                    'id': 'up' + fkKey,
                    text: fkVal
                });
                $labelFor = $('<label>', {
                    html: dbField.replace(new RegExp("_", "g"), " "),
                    width: '130px',
                    'for': 'up' + dbField
                });
            }

            $inputFor.val(fkVal);

            if ($tr.data("pathway") && $tr.data("pathway").left(10) == "Adding mtm" && $inputFor.attr('id') == "upLocation_Id") {
                $inputFor.prop("disabled", true);
            }
            //#endregion
        }

        //#region Append $newP to the Update Div

        // Now append the new label and input field to the div
        $newP.append($labelFor);

        if (dbAttrs.DataType === "Upload") {
            // special processing for documentation fields to add a doco anchor element and a file upload input element.            
            $newP.append($docoAnchor);
            $newP.append($docoUploadFor);
            $newP.append($docoRemove);
            $newP.append($inputFor);
        } else {
            $newP.append($inputFor);
            if (!(sessionStorage.userrole === "Admin" || sessionStorage.userrole === "TRACS_Admin")) {
                $inputFor.prop("disabled", "true");
            }
        }

        var dbFieldPrimPos = false;     // Project to add the Audit Name (now a foreign key field) to the beginning of audit update screen
        dbFieldPrimPos = objModel[dbField].hasOwnProperty('PrimaryPosition');   // Does this foreign key field have a Primary Position annotation in the model

        if (dbFieldPrimPos) {       //  if this field has a Primary Position annotation in the model, insert the <p> element after the Id field
            $newP.insertAfter($("#divUpdate").find("p:first-child"));
        } else {
            $("#divUpdate").append($newP);
        }

        dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldRE = false, dbFieldEM = false, dbFieldDT = false, dbFieldRng = false,
        dbFieldSize = false, dbFieldDS = false, dispField = true, dbFieldColl = false, dbFieldKey = false, dbBoolDisplay = false, dbRequired = true,
        validationRegEx = "", validationErrMsg = "", validationType = "input", validationPlcHolder = "", validationMin = "",
        validationMax = "", validationSize = "", validationMaxLgth = "";

        //#endregion
    }

    //#region Add elements after input field

    // Add a message after the key field to inform the user it cannot be updated
    $("#frmUpdate p:nth-of-type(1) input").after("<span style='color:black;font-size:0.9em;margin-left:10px'>The key field is disabled.</span>");

    // Add a red asterix after every input element that does not have a disabled attribute set i.e the key fields
    $("#frmUpdate select").after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");
    $("#frmUpdate input").not('[disabled]').after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");

    // Immediately hide the red asterix for valid input and select fields
    $("#frmUpdate input:valid").next("span").hide();
    $("#frmUpdate select").trigger("change");   // more complicated for select option group
    //#endregion    
}

function buildInsertModal() {

    $("#divUpdate").empty();

    $("#modalUp").prop("disabled", false);      // may have previously been set to disabled in file handler routine

    // regex string manipulation - finds each occurance of a lower case character followed by an upper case character, and inserts a space between them
    var modelText = model.replace(/([a-z])([A-Z])/g, '$1 $2');
    $("#ModalTitle").text("Add " + modelText.replace(new RegExp("_", "g"), " ")); // caption on update modal

    var lblText,
      inputId,
      $labelFor,
      $inputFor,
      $newP,
      objModel = {};

    var dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldRE = false,
        dbFieldEM = false, dbFieldDT = false, dbFieldRng = false, dbFieldDS = false, dispField = true, dbFieldColl = false, dbFieldKey = false, dbIdentity = false,
        dbBoolDisplay = false, dbRequired = true,
        validationRegEx, validationErrMsg, validationPlcHolder, validationType, validationMin, validationMax, validationSize, validationMaxLgth, tmpValue, dbAttrs = {};

    var modelEval = "meta" + model;
    var objModel = window[modelEval]; //var objModel = (eval(model)); - Changed 03/05/2018 

    for (var dbField in objModel) {

        dbAttrs = objModel[dbField];    // dbAttrs contains the code first annotations for the current field in the current model

        if (dbAttrs.hasOwnProperty("NaturalkeyAttribute")) {
            $("#modalUp").attr('data-natural-key', true);   // informs updateRecord() this is a natural key insert
        }

        $newP = $("<p></p>");

        inputId = dbField;

        dbFieldFT = objModel[dbField].hasOwnProperty('ForeignTbl'); // Is this db field a foreign lookup table property in the model, such as CostCentre and Title in Employee
        dbFieldFK = objModel[dbField].hasOwnProperty('ForeignKey'); // Is this db field a foreign key field in the model, such as cost_centre_id
        dbFieldTS = objModel[dbField].hasOwnProperty('Timestamp'); // Is this db field a time stamp field in the model
        dbFieldRE = objModel[dbField].hasOwnProperty('RegularExpression'); // Does this db field have a regular expression annotation in the model
        dbFieldEM = objModel[dbField].hasOwnProperty('ErrMsg'); // Does this db field have an error message annotation in the model
        dbFieldDT = objModel[dbField].hasOwnProperty('DataType'); // Does this db field have a data type annotation in the model
        dbFieldRng = objModel[dbField].hasOwnProperty('MinValue'); // Does this db field have a Min Value - only range expressions have a min value.
        dbFieldSize = objModel[dbField].hasOwnProperty('StringLength'); // Does this db field have a string length attribute
        dbFieldDS = objModel[dbField].hasOwnProperty('Display'); // Does this db field have a string length attribute
        dbFieldKey = objModel[dbField].hasOwnProperty('Key');

        if (objModel[dbField].hasOwnProperty('DBGen')) {
            if (dbAttrs.DBGen) {
                dbIdentity = true;
            }
        }

        lblText = dbAttrs.Display;
        $labelFor = $('<label>', {
            html: lblText,
            'for': 'up' + inputId
        });

        // setup a placeholder field based on the property type of the current field
        if (dbAttrs.PropType === "Int32") {
            validationPlcHolder = "0...9";
        }
        else if (dbAttrs.PropType === "String") {
            validationPlcHolder = "Aa..Zz";
        }
        else if (dbAttrs.PropType === "Collection") {
            dbFieldColl = true;
        }
        else if (dbAttrs.PropType === "Boolean") {
            dbBoolDisplay = true;
        }

        // if this is a foreign table collection, move to the next item in the for...each loop
        if (dbFieldColl || dbField === "name") {
            { continue; }
        }

        if (dbAttrs.PropType.search(/nullable/i) >= 0) {    // case insensitive search for nullable field type which drives the HTML5 required field.
            dbRequired = false;
        }

        // override placeholder field if the field has a datatype of 'email', otherwise keep the one already created.

        if (dbFieldDT) {
            if (dbAttrs.DataType === "Email") {
                validationType = 'email'; // HTML5 performs validation
                validationPlcHolder = "some.one@hnehealth.nsw.gov.au";
                validationSize = "60";
            }
            else if (dbAttrs.DataType === "Date") {
                // regular expressions are normally set in the model, but modelbinder expects the date in the ISO 8601 format, YYYY/MM/DDT00:00:00Z
                // the date entered here in dd/mm/yyyy format is converted to ISO 8601 format in updateRecord()
                // So the reg ex cannot be set in the model, as it would work for the front-end to enter in dd/mm/yyyy, and then fail the modelbinder test in the api controller
                //validationType = 'date'; 
                validationPlcHolder = "DD/MM/YY";
                validationRegEx = "(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}";
                validationErrMsg = "Value must be a date in the format DD/MM/YYYY";
            }
        }

        if (dbFieldEM) {
            validationErrMsg = dbAttrs.ErrMsg;
        }

        if (dbFieldRE) {
            validationRegEx = dbAttrs.RegularExpression;
            validationErrMsg = dbAttrs.RegExMSG;
        }

        if (dbFieldRng) {
            validationType = 'number';
            validationMin = dbAttrs.MinValue;
            validationMax = dbAttrs.MaxValue;
            validationMaxLgth = validationMax.length;
            validationSize = validationMaxLgth;
            validationErrMsg = "You must enter " + validationSize + " digits";
        }

        if (dbFieldSize) {
            validationSize = dbAttrs.StringLength;
            validationMaxLgth = dbAttrs.StringLength;
        }

        dispField = dbAttrs.ForDisplay;

        if (!dbFieldFT) {           // if this field is not a foregin lookup table property in the model, build the input field

            //#region Build the input field for non Foreign Key fields

            // regular fields are have a 'ForDisplay' boolean attribute of true on the model
            // If this is a regular field build the input field.
            // If this is a non-regular field e.g. timestamp, active, one of the fk fields e.g. cost_centre_id -  create a hidden input field and set the label to hidden

            if (dispField) {
                if (!dbBoolDisplay) {
                    $inputFor = $('<input/>').attr({
                        'type': validationType,
                        'id': 'up' + inputId,
                        'placeholder': validationPlcHolder,
                        'title': validationErrMsg,
                        'size': validationSize,     // display size of input field
                        'maxlength': validationMaxLgth,     // maximum number of input chars allowed
                        'pattern': validationRegEx,
                        'class': 'form-control',
                        'required': true,
                        'value': tmpValue,
                        'min': validationMin,
                        'max': validationMax
                    });

                    if (!dbRequired) {
                        $inputFor.removeAttr("required");    // for nullable fields, remove the required attribute - essentially saying required='false' but that syntax doesn't work
                    }

                    // TRACS fudge to disable user entry of documentation date - this is set by the system
                    // if (dbField.search(/documentation_date/i) >= 0) {                    
                    if (dbField.search(/document/i) >= 0) {
                        $inputFor.prop("disabled", true);
                    }

                    if (dbAttrs.DataType === "Upload") {
                        // this routine applies to documentation fields
                        // An anchor tag is created to allow users to link to the doco, but is appended to the new paragraph seperately from $inputFor which is still required for the updateRecord)
                        $inputFor = $('<input/>').attr({
                            'id': 'up' + inputId,
                            'value': "No Evidence",
                        });
                        $inputFor.attr({ 'hidden': 'true' });
                    }

                    // End doco Code

                    // attach jQuery-UI datepicker to date input fields
                    if (dbFieldDT) {
                        if (dbAttrs.DataType === "Date") {
                            var now = new Date();
                            var nowYear = now.getFullYear();
                            var minYear = nowYear - 1;
                            var maxYear = nowYear + 1;
                            var minDate = new Date(minYear, 0, 1);      // JavaScript counts months from 0 to 11. January is 0. December is 11.
                            var maxDate = new Date(maxYear, 11, 31);
                            $inputFor.datepicker({
                                dateFormat: 'dd/mm/yy',
                                //numberOfMonths: [2, 2],
                                minDate: minDate,
                                maxDate: maxDate,
                                //showAnim: "blind", // removed because interferring with tab  // https://api.jqueryui.com/category/effects/
                                showOn: "both",
                                showOtherMonths: true,
                                showOtherYears: true,
                                changeMonth: true,
                                changeYear: true,
                                yearRange: "-1:+1",
                                onSelect: function (selectedDate) {
                                    $(this).change();   // datepicker doesn't automatically fire the onChange evvent, so manually fire it to remove the red asterix for invalid entry                               
                                    var $inputs = $(this).closest('form').find(':focusable');
                                    var $thisInput = $inputs.eq($inputs.index(this));
                                    var $nextInput = $inputs.eq($inputs.index(this) + 1).find("[type!='hidden']");
                                    var id = $nextInput.attr('id');
                                    $nextInput.focus();
                                },
                                beforeShow: function (input, inst) {    // controls placement of the datepicker
                                    var htOffset = input.offsetHeight - 30; // 20/4/2018 - Change to position relative to input field
                                    inst.dpDiv.css({ marginTop: htOffset + 'px', marginLeft: (input.offsetWidth + 10) + 'px' });
                                    //inst.dpDiv.css({ marginTop: input.offsetHeight + 'px', marginLeft: (input.offsetWidth + 10) + 'px' });
                                }
                            });
                        }
                    }
                }
                else {  // Boolean display field e.g. Finalised
                    // Create a checkbox with the initial checked property and value set.
                    // Changes to the checkbox are handled in the delgated event handler $("#frmUpdate").on("change", "input[type=checkbox]",.....
                    $inputFor = $('<input/>').attr({
                        'type': 'checkbox',
                        'id': 'up' + dbField,
                        'class': 'form-control'
                    });
                    $inputFor.prop('checked', false);
                    $inputFor.val("0");
                    $inputFor.prop('disabled', true);
                }
            }   // Not a display field
            else {
                $labelFor.attr({ 'hidden': 'true' });
                IDTEMP = 'UP' + inputId;
                $inputFor = $('<input/>').attr({ type: 'input', 'id': 'up' + inputId, 'hidden': 'true' });
                if (dbFieldFK) {   // If this is a foreign key field, change it's Id
                    var modalFK_Id = 'modalFK_Id' + inputId;
                    $inputFor.attr({ 'id': modalFK_Id });
                }
                // On insert, set the default value of hidden boolean fields
                if (dbBoolDisplay && !dispField) {
                    if (inputId.search(/active/i) >= 0) {
                        $inputFor.attr({ 'value': true });
                    } else {
                        $inputFor.attr({ 'value': false });
                    }
                }
            }

            if (dbFieldKey && dbIdentity) {
                $inputFor.prop("disabled", true);
                $inputFor.after("<span style='color:black;font-size:0.9em;margin-left:10px'>Disabled</span>");
            }
        }
            //#endregion

        else {

            //#region Build select elements with options set to the value of the Foreign Key Fields

            fkKey = dbField + "_Id";    // name of corresponding fk field
            var objColl = window[dbField];  // objColl is now a collection of the foreign table - uses evil eval.

            $inputFor = $('<select/>').attr({
                'type': 'input',
                'id': 'up' + fkKey,
                'required': 'true',
                'class': 'form-control'
            });

            $inputFor.css('min-width', '40%');  // Set the minimum width of the select box with respect to the modal screen

            $selectOption = $('<option/>').attr({ 'value': '' }).text(' Please Select  ');
            $inputFor.append($selectOption);

            var acArray = [];   // for trial of autocomplete
            // build a dropdownlist from the collection object of the foreign lookup tables
            for (var collField in objColl) {
                if (objColl[collField] !== objColl.name) {
                    $selectOption = $('<option/>').attr({ 'value': collField }).text(objColl[collField]);
                    acArray.push(objColl[collField]);    // for trial of autocomplete - fill array with option text
                }
                $inputFor.append($selectOption);
            }

            // this borrowed routine is to sort the FT options for the select list by text rather than value.
            // the FT object is automatically sorted by value rather then text
            var options = $("option", $inputFor);
            var arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value }; }).get();
            arr.sort(function (o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
            options.each(function (i, o) {
                o.value = arr[i].v;
                $(o).text(arr[i].t);
            });

            $inputFor.autocomplete({ source: acArray });     // for trial of autocomplete - the source option (mandatory) requires an array, not an object

            $newP.append($labelFor);
            $newP.append($inputFor);
            $("#divUpdate").append($newP);

            //#endregion
        }

        //#region Append $newP to the Update Div

        // Now append the new label and input field to the div
        if (dbAttrs.DataType === "Upload") {
            $newP.append($inputFor);
        }
        else {
            $newP.append($labelFor);
            $newP.append($inputFor);
        }

        var dbFieldPrimPos = false;     // Project to add the Audit Name (now a foreign key field) to the beginning of audit update audit screen
        dbFieldPrimPos = objModel[dbField].hasOwnProperty('PrimaryPosition');   // Does this foreign key field have a Primary Position annotation in the model

        if (dbFieldPrimPos) {       //  if this field has a Primary Position annotation in the model, insert the <p> element after the Id field
            $newP.insertAfter($("#divUpdate").find("p:first-child"));
        } else {
            $("#divUpdate").append($newP);
        }

        // reset validation variables to their defaults
        dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldRE = false, dbFieldEM = false, dbFieldDT = false, dbFieldRng = false,
        dbFieldSize = false, dbFieldDS = false, dispField = true, dbFieldColl = false, dbIdentity = false, dbFieldKey = false, dbBoolDisplay = false, dbRequired = true,
        validationRegEx = "", validationErrMsg = "", validationType = "input", validationPlcHolder = "", validationMin = "",
        validationMax = "", validationSize = "", validationMaxLgth = "", tmpValue = "";

        //#endregion
    }

    //#region Add elements after input field

    // Add a red colored * after every input element
    $("#frmUpdate input:invalid, #frmUpdate select:invalid").after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");

    //#endregion
}

function buildHeaderRow(objModel, buildType) {

    // Pretty much the same routine in BuildDataRow() to build the data row
    if (buildType === "Standard") {
        $("#table_data > tbody,#table_data > thead").empty();
    }
    else if (buildType === "MTM") {
        $("#table_data_mm > tbody,#table_data_mm > thead").empty();
    }
    else if (buildType === "Details") {
        $("#table_data_details > tbody,#table_data_details > thead").empty();
    }
    // Create $tr and prepend row number row header
    var $tr = $('<tr/>');
    $tr.append($('<th/>', {
        text: "#"
    }));

    arrObjects.length = 0;   //  reset arrObjects - contains a list of model fields that are FK fields e.g. costcentre_id

    var dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldKEY = false, dispField = true;  // Assoc_Child = false, 

    for (var dbField in objModel) {

        var dbAttrs = objModel[dbField];    // dbAttrs contains the code first annotations for the current field in the current model
        dbFieldFT = objModel[dbField].hasOwnProperty('ForeignTbl'); // Is this db field a foreign lookup table in the model, such as CostCentre and Title in Employee
        dbFieldFK = objModel[dbField].hasOwnProperty('ForeignKey'); // Is this db field a foreign key field in the model, such as cost_centre_id
        dbFieldTS = objModel[dbField].hasOwnProperty('Timestamp');  // Is this db field a time stamp field in the model
        dbFieldKEY = objModel[dbField].hasOwnProperty('Key');       // Is this db field the key field in the model

        //dbAttrs = objModel[dbField];    // dbAttrs contains the code first annotations for the current field in the current model

        // if this is a foreign table collection, move to the next item in the for...each loop  e.g. Audit_Measures in Audit
        if (dbAttrs.PropType === "Collection") {
            { continue; }
        }

        // Assumption made that every object has a 'Display' attribute except for Collection fields
        if (dbAttrs.Display) {
            colName = dbAttrs.Display.replace(new RegExp("_", "g"), " ");
        }

        dispField = dbAttrs.ForDisplay;

        if (dbFieldFT) {
            arrObjects.push(dbField); // used later and in buildDataRow() to append foreign lookup field col headers at the end
        }
        else {
            if (dispField) {
                $tr.append($('<th/>', {
                    text: colName
                }));
            }
        }
        dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldKEY = false, dispField = true;
    }

    // Change order of items...append foreign lookup table fields to the end.
    for (var fk in arrObjects) {
        var dbFieldPrimPos = false;     // Project to add the Audit Name (now a foreign key field) to the beginning of the table row
        dbFieldPrimPos = objModel[arrObjects[fk]].hasOwnProperty('PrimaryPosition');   // Does this db field have a Primary Position annotation in the model
        dbAttrs = objModel[arrObjects[fk]];
        colName = dbAttrs.Display.replace(new RegExp("_", "g"), " ");
        if (dbFieldPrimPos) {       //  if this field has a Primary Position annotation in the model, insert the <th> element after the row counter <th>
            $('<th/>', {
                text: colName
            }).insertAfter($tr.find("th:first-child"));
        }
        else {
            $tr.append($('<th/>', {
                text: colName
            }));
        }
    }

    if (buildType === "Standard") {
        //$tr.append($('<th/>', { text: "Inactivate" })).append($('<th/>', { text: "Update" }));
        $tr.append($('<th/>', { text: "Update" }));
        $('#table_data > thead').append($tr);
    }
    else if (buildType === "MTM") {
        $('#table_data_mm > thead').append($tr);
    }
    else if (buildType === "Details") {
        //$tr.append($('<th/>', { text: "Inactivate" })).append($('<th/>', { text: "Update" })); // 5/12/2017 - removed Inactivate Button
        $tr.append($('<th/>', { text: "Update" }));
        $('#table_data_details > thead').append($tr);
    }

    // end of building the header row
}

function buildDataRow(item, objModel, buildType, p_id) {

    p_id = p_id || 0;           // passed to function when building child detail rows - optional field that is initialised to zero if not passed
    var colCounter = 1;         // cater for row number col artificially added outside of model fields   
    rowNum++;

    // create $tr and append <td> containing current row number
    var $tr = $('<tr/>').append($('<td/>', {
        text: rowNum,
        class: buildType === "Details" ? "detail_row" : "",
        style: 'width:3%;text-align:center;'
    }));

    // #region Audit_Finalised - Part of code block to allow/deny ability to add evidence at the major Audit level.
    // A data attribute is added to the row indicating if all Audit Measure Assessments for the Audit have been attended.
    $tr.attr('data-finalised', true);
    if (model == "Audit" && buildType == "Standard") {       
        var Audit_Measures = item.Audit_Measures;
        $.each(Audit_Measures, function (key, AM) {
            if (AM.Finalised == false) {
                $tr.attr('data-finalised', false);
                return false;
            }
        });
    }
    //#endregion Audit_Finalised

    //#region Main Loop Through Model

    var dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldKEY = false, dbFieldDT = false, dispField = true, emailAppend = "", data_location = "", data_compliance_area = "",
    data_campus = "", $docoAnchor, data_parent_audit_name = "", key_value = "", data_audit_date = "", data_assessment_due_date, data_abbreviated_name = "", data_mtm_added = false, dbAttrs = {};

    for (var dbField in objModel) {

        dbFieldFT = objModel[dbField].hasOwnProperty('ForeignTbl'); // Is this db field a foreign lookup table in the model, such as CostCentre and Title in Employee
        dbFieldFK = objModel[dbField].hasOwnProperty('ForeignKey'); // Is this db field a foreign key field in the model, such as cost_centre_id
        dbFieldTS = objModel[dbField].hasOwnProperty('Timestamp');  // Is this db field a time stamp field in the model
        dbFieldKEY = objModel[dbField].hasOwnProperty('Key');       // Is this db field the key field in the model
        dbFieldDT = objModel[dbField].hasOwnProperty('DataType');   // Does this db field have a data type annotation in the model

        dbAttrs = objModel[dbField];    // contains the EF annotations for the current property in the current model

        // if this is a foreign table collection, move to the next item in the for loop e.g. Audit_Measures in Audit
        // If this is the name property, move to the next item
        if (dbAttrs.PropType === "Collection" || dbField === "name") {
            { continue; }
        }

        dispField = dbAttrs.ForDisplay;

        // $value has been added to be able to manipulate the display values of boolean fields i.e. true='yes', false='No'
        var $value = item[dbField];

        // If not a foreign table collection
        if (!dbFieldFT) {
            // Exclude unwanted fields from display the data row e.g. timestamp,active,middle name and fk fields
            // All these fields have a display annotation property AutoGenerateField=true
            // Don't display but included as 'hidden' for passing to update routine.
            if (dbFieldDT) {
                if (dbAttrs.DataType === "Email") {
                    var firstName = item.FullName.split(' ')[0];     // use first word of full name in case name prefix of email address differs to name
                    // "%0D%0A" represents a new line character - see http://www.rapidtables.com/web/html/mailto.htm
                    emailAppend = "<a href=mailto:" + item[dbField] + "?bcc=shaun.keegan@hnehealth.nsw.gov.au&amp;subject=Your&nbsp;Subject&nbsp;&amp;body=Dear&nbsp;" + firstName + "%2C" + "%0D%0A" + "&nbsp;" + "%0D%0A" + "Write&nbsp;your&nbsp;message&nbsp;here." + ">" + $value + "<span class='glyphicon glyphicon-envelope'>" + "</a>";
                }
                else if (dbAttrs.DataType === "Date") {
                    if ((item[dbField])) {
                        // Method 1 using moment.js
                        //var momentDate = moment(item[dbField]);
                        //var jsDate = momentDate.toDate();
                        //var localDate = jsDate.toLocaleDateString();

                        // method 2 - using vanilla JS - works
                        //dateValue = new Date(item[dbField]);   //   JavaScript's Date object supports ISO 8601 out of the box.              
                        //item[dbField] = dateValue.toLocaleDateString();  // set the item for display on the grid to the parsed value. 

                        // method 3 using moment.js
                        $value = moment.utc(item[dbField]).format("DD/MM/YYYY");
                        item[dbField] = $value;
                    }
                }
            }

            if (dispField) {

                if (dbAttrs.PropType === "Boolean") {           // manipulate display field for Booleans
                    $value = $value === true ? "Yes" : "No";    // assumption - a field containing a boolean display value will always be non null in the database              
                }

                if (dbAttrs.DataType === "Upload") {
                    // this routine applies to documentation fields
                    // An anchor tag is created to allow users to link to the doco, but is appended to the td )

                    // If not nulls, the doco link is stored as the full html string. Converting it to a jQuery object creates an element with a string length of 1
                    // If nulls, when converted to a jQuery object it will have a string length of 0 
                    var $glyphSpan, $toolSpan, $fileLoc;
                    if ($value !== "No Evidence") {
                        $docoAnchor = $('<a>', {
                            href: "file:" + sessionStorage.baseShareLoc + $value,
                            target: "_blank"
                        });
                        var $lngth = $docoAnchor.attr('href').length;
                        $fileLoc = $docoAnchor.attr('href').substring(5, $lngth);
                        $docoAnchor.attr({ 'class': 'doco dontPrint' });  //
                        $glyphSpan = $('<span/>', {
                            class: 'glyphicon glyphicon-file'
                        });
                        $docoAnchor.append($glyphSpan);
                        // Pseudo tooltip - a span tag, $toolSpan, is created and appended to the anchor tag. This pops up when hovered over, allowing it to be styled 
                        // title props are hard to style.
                        $toolSpan = $('<span/>', {
                            text: $fileLoc
                        });
                        $docoAnchor.append($toolSpan);
                    }
                    else {
                        // These are records without evidence                                                    
                        // Create a disabled documentation anchor which is later updated and shown in the file upload handler 
                        $docoAnchor = $('<a>', {
                            href: "",
                            text: "",
                            'class': 'doco disabledControl dontPrint'
                        });
                        $glyphSpan = $('<span/>', {
                            class: 'glyphicon glyphicon-remove'
                        });
                        $docoAnchor.append($glyphSpan);
                    }
                    $value = $docoAnchor;
                }

                colCounter++;
                $tr.append($('<td/>', {
                    id: dbField,
                    html: emailAppend ? emailAppend : $value,       // Based on Udemy lecture on coercion and test for existance. An empty string is coerced to boolean false.
                    // emailAppend ? - returns false if it is an empty string
                    class: buildType === "Details" ? "detail_row" : "",
                    'style': dbField == "Audit_Name" ? "Color:Blue" : ""
                }));

                // Hack to highlight finalised 'completed' field if all AMA's have been completed....Audit Measures are now updated to completed when the all child assessments have doco uploaded.
                if (objModel.name == "Audit_Measure") {
                    // See old code in archive section. Use in case 'contains' is deprecated.
                    $tr.children('td:contains("Yes")').css({ 'background-color': 'lightgreen', font: 'bold' });
                }
            }
            else {  // timestamp, active,middle name, foreign key or other deplorables
                $tr.append($('<td/>', {
                    id: dbField,
                    text: item[dbField],
                    attr: ({
                        hidden: 'true'
                    })
                }));
            }

            // Give the row an id of the key field -  'key' is an annotation in the model
            if (dbFieldKEY) {
                $tr.attr("id", item[dbField]);
                key_value = item[dbField];      // added later to OTM buttons to show children
            }

            // TRACS fudges for later use in file upload handler

            // applies to the fields in Audit_Measure_Assessment where the field is not a foreign table but derived from its associated parents/grand parents foreign tables

            // applies to the location field in Audit_Measure_Assessment - see model
            if (dbField.search(/location/i) === 0 && dbField.search(/id/i) === -1) {
                data_location = item[dbField];
            }
            // applies to the campus field in Audit_Measure_Assessment - see model
            if (dbField.search(/campus/i) === 0 && dbField.search(/id/i) === -1) {
                data_campus = item[dbField];
            }
            // applies to the compliance_area field in Audit_Measure_Assessment - see model
            if (dbField.search(/compliance_area/i) === 0 && dbField.search(/id/i) === -1) {
                data_compliance_area = item[dbField];
            }
            // applies to the parent_audit_name field in Audit_Measure_Assessment - see model
            if (dbField.search(/parent_audit_name/i) === 0 && dbField.search(/id/i) === -1) {
                data_parent_audit_name = item[dbField];
            }

            // these are fields that may or may not be there - see model
            if (dbField.search(/mtm_added/i) >= 0) {
                data_mtm_added = item[dbField];
            }
            if (dbField.search(/due_date/i) >= 0) {
                data_audit_date = item[dbField];
            }
            if (dbField.search(/Parent_Audit_Due_Date/i) >= 0) {    // Parent_Audit_Due_Date only exist in Audit_Measure_assessment and is derived from the parent audit's due date.
                data_audit_date = item[dbField];      // data_audit_date is later used in the file handler to extract the year of the audit or parent audit
                data_assessment_due_date = item["Audit_Measure_Assessment_Due_Date"];   //  massive TRACS hack
            }
        }   // End of test for foreign table
        dbFieldFT = false, dbFieldFK = false, dbFieldTS = false, dbFieldKEY = false, dbFieldDT = false, dispField = true, emailAppend = "";
    }   // end of dbField in objModel for loop
    //#endregion   

    //#region Build_Foreign_Table_Dropdown

    // Foreign key lookup tables are appended to the end.
    var fieldNameObjVal;
    for (var fk in arrObjects) {
        var dbFieldPrimPos = false;     // Project to add the Audit Name (now a foreign key field) to the beginning of the audit record after the row counter
        var fieldName = arrObjects[fk];
        // Workaround to cater with not being able to seed Position records because of a syntax error on compilation when trying to add Position seed data
        // Because of this, in the CostCentre model, had to set Position_Id to nullable, and also allow null in Position_Id in Cost Centres as initialisation data.
        // Development issue only - If Position is missing, ergo, so is FullName and it will fall over

        dbFieldPrimPos = objModel[fieldName].hasOwnProperty('PrimaryPosition');   // Does this foreign key field have a Primary Position annotation in the model

        var FTName = item[fieldName];   // contains the associated foreign table record
        if (FTName !== null) {

            if (dbFieldPrimPos) {       //  if this field has a Primary Position annotation in the model, insert the <td> element after the row counter column                
                $('<td/>', {
                    text: FTName.FullName,
                    class: buildType === "Details" ? "detail_row" : "full_name",
                    'style': fieldName == "Audit_Type" ? "Color:Blue" : ""
                }).insertAfter($tr.find("td:first-child")).append($('<span/>', {    // add tooltip to display the abbreviated name if this is the Audit Type model
                    text: FTName.hasOwnProperty("Audit_Type_Abbrv_Name") ? FTName.Audit_Type_Abbrv_Name : "",
                    'style': fieldName == "Audit_Type" ? "Color:Blue" : ""
                }));
            }
            else {
                $tr.append($('<td/>', {
                    text: FTName.FullName,
                    class: buildType === "Details" ? "detail_row" : "",
                    'style': fieldName == "Audit_Measure_Task" ? "Color:Blue" : fieldName == "Audit_Measure" ? "Color:green;font-weight:bold" : fieldName == "Location" ? "Color:Red" : ""
                }));
            }

            // TRACS fudges to provide the location and compliance area of the parent to the child details modal
            if (fieldName === 'Location') {
                data_location = FTName.FullName;
                data_campus = FTName.Campus.FullName;
            }
            if (fieldName === 'Compliance_Area') {
                data_compliance_area = FTName.FullName;
            }

            colCounter++;
        }
        else {
            $tr.append($('<td/>', {
                text: "",
                class: buildType === "Details" ? "detail_row" : ""
            }));
        }
    }
    //#endregion 

    // Critical Assumption - every object in the model has a FullName property
    //#region Set Data-* Attributes
    $tr.attr('data-name', item.FullName);   // Used later in event handler for the InActivate button and file handling   
    // For those models with a location foreign table, supply this to the next routine.
    data_location ? $tr.attr('data-location', data_location) : $tr.attr('data-location', "");
    // For those models with a compliance area foreign table, supply this to the next routine.
    data_compliance_area ? $tr.attr('data-compliance-area', data_compliance_area) : $tr.attr('data-compliance-area', "");
    // For those models with an abbreviated name, due date and campus fields.
    //data_abbreviated_name ? $tr.attr('data-abbreviated-name', data_abbreviated_name) : $tr.attr('data-abbreviated-name', "");
    data_audit_date ? $tr.attr('data-audit-date', data_audit_date) : $tr.attr('data-audit-date', "");
    data_assessment_due_date ? $tr.attr('data-assessment-due-date', data_assessment_due_date) : $tr.attr('data-assessment-due-date', "");
    data_campus ? $tr.attr('data-campus', data_campus) : $tr.attr('data-campus', "");
    data_parent_audit_name ? $tr.attr('data-parent-audit-name', data_parent_audit_name) : $tr.attr('data-parent-audit-name', "");
    $tr.attr('data-audit-type', 'WHS'); // Hard-Coded Audit Type at this stage - 'WHS' or 'Clinical'
    //#endregion

    //#region ModelAssociations
    //  Code to store the array of buttons in html5 storage to be worked on later, so we need to perform this only once.
    var assocBtns = [];
    var assocHdrs = [];
    var assocModel = objModel.name + 's';
    determineModelAssociations(assocModel, assocBtns, assocHdrs, objModel.name, buildType, rowNum, key_value, data_mtm_added);    // build buttons at end of row based on model relationships 
    //#endregion

    //#region Append $tr to data table

    // variable buildType controls which data-table is being built - the standard or mtm table
    if (buildType === "Standard") { // we are on standard table display of records.
        // 5/12/2017 - removed Inactivate Button    - see archived code
        var $btnUpdate = $('<input>', {
            class: "update btn btn-default btn-xs btn-block",
            type: "button",
            role: "button",
            value: "Edit"
        });
        $btnUpdate.attr('data-model', objModel.name);
        $tr.append($('<td/>', {
            html: $btnUpdate,
            'style': 'width:5%;text-align:center;'
        }));
        colCounter += 1;

        // the row btns and headers to add are added to an array built in determineModelAssociations
        for (var btnAssoc in assocBtns) {       // add btns to end of row
            $tr.append($('<td/>', {
                html: assocBtns[btnAssoc],
                'style': 'width:5%;text-align:center;'
            }));
            colCounter++;
        }
        for (var hdrAssoc in assocHdrs) {       // add cols to header row
            $('#table_data > thead > tr').append($('<th/>', {
                text: assocHdrs[hdrAssoc]
            }));
        }

        $('#tbody_data').append($tr);    // Append the current table row to the body of the table.

        if ($updatedRow) {          // If this is a rebuild of a row being updated, highlight the row by simulating a click event on it
            if ($($updatedRow).attr('Id') == $tr.attr('Id')) {
                $($updatedRow).click(); $updatedRow = null;
            }
        }
    }
    else if (buildType === "Details") {

        $tr.attr('data-parent_id', p_id);   // store parent row Id for later use attaching to update button of the update modal for a detail record.        

        // Used javascript method to create the element instead of jQuery for the details row buttons
        // This is because I couldn't get the delegated event handler working on the Edit button using the usual jQuery delegated event handler method
        var $btnUpdate = document.createElement('input');
        $btnUpdate.type = "button";
        $btnUpdate.value = "Edit";
        $btnUpdate.role = "button";
        $btnUpdate.setAttribute('class', "update btn btn-default btn-xs btn-block");
        $btnUpdate.setAttribute('data-child', objModel.name);   // used later to update the details row child
        $btnUpdate.setAttribute('data-model', objModel.name);   // used later to update the details row child
        $btnUpdate.addEventListener('click', detailsUpdateBtnHandler, false);

        colCounter += 2;
        $tr.append($('<td/>', {
            html: $btnUpdate,
            class: "detail_row",
            'style': 'width:5%;text-align:center;'
        }));
        colCounter++;

        // the row btns and headers to add are added to an array built in determineModelAssociations
        for (var btnAssoc in assocBtns) {       // add btns to end of row
            $tr.append($('<td/>', {
                html: assocBtns[btnAssoc],
                class: "detail_row",
                'style': 'width:5%;text-align:center;'
            }));
            colCounter++;
        }
        for (var hdrAssoc in assocHdrs) {       // add cols to header row
            $('#table_data_details > thead > tr').append($('<th/>', {
                text: assocHdrs[hdrAssoc]
            }));
        }

        $('#tbody_data_details').append($tr);    // Append the current table row to the body of the table.
    }
    else if (buildType === "MTM") {
        // we are on the modal to display MTM child records.       
        // the row btns and headers to add to the rows are in an array built in determineModelAssociations
        for (var btnAssoc in assocBtns) {       // add btns to end of row
            $tr.append($('<td/>', {
                html: assocBtns[btnAssoc],
                'style': 'width:5%;text-align:center;'
            }));
            colCounter++;
        }
        for (var hdrAssoc in assocHdrs) {       // add cols to header row
            $('#table_data_mm > thead > tr').append($('<th/>', {
                text: assocHdrs[hdrAssoc]
            }));
        }

        $tr.attr('data-parent_id', p_id);        // passed from child records update modal - all child records must have a parent id
        $('#tbody_data_mm').append($tr);        // Append the current table row to the body of the Many table.

        // Add a row that will contain the detail/child records of the current row
        // a <td> is created here that will later be filled with child detail rows in the ".show-children" click event 
        var $tr_detail = $('<tr/>');
        var $tr_id = $tr.attr('id');                // id of the current master row
        $tr_detail.attr("id", "det" + $tr_id);      // id of the row that will contain the child details rows

        $tr_detail.append($('<td/>', {
            colspan: colCounter,
            id: "detailsContainer" + $tr_id,                    // a <td> that is a container for child detail rows - for use in ".show-children" click event 
            class: "detail detail_row detail_row_container",     // dummy classes to control hovering of child record rows
            'style': 'padding-left:1%;'
        }));
        $('#tbody_data_mm').append($tr_detail);
    }
}

function detailsUpdateBtnHandler() {

    $("#modalMTMUpdate").toggle();
    detailsUpdate = true;

    cleanUp();
    // Populate the form from data attribute values attached to the update button while building the row.
    // Note: employee id and timestamp are displayed in label fields.
    // Note: .data handler - jQuery handler for getting and setting HTML5 data attributes.
    var $tr = $(this).closest('tr');    //  Currently selected row
    var $child_model = $(this).data("child"); // 'this' is the button pressed - data-child is set in BuildDataRow for the OTM buttons in the "Details" build type.    
    $tr.attr('data-child', $child_model);
    var $model = $(this).data("model");
    $tr.attr('data-model', $model);
    var $parent_id = $($tr).data('parent_id');
    var modelEval = "meta" + $child_model;    
    var objModel = window[modelEval]; // eval(modelEval);   - Changed 03/05/2018 
    buildUpdateModal($tr);
    $('#modalUp').text("Update");
    $('#modalUpdate').modal({ backdrop: 'static', keyboard: false });  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.
}

function determineModelAssociations(assocModel, assocBtns, assocHdrs, currModelName, buildType, rowNum, key_value, data_mtm_added) {
    var key_value = key_value || 0;   // known fudge for optional parameters
    if (metaAssociations.hasOwnProperty(assocModel)) {  // If this model object is in an association with another model object
        var Assoc_Text, Assoc_Type, Assoc_With, Assoc_With_Left, Assoc_Btn_Text, Assoc_Child_Model, Assoc_Parent_Model;
        var metaAssociationItem = metaAssociations[assocModel];

        for (var lstItem in metaAssociationItem) {
            Assoc_Text = metaAssociationItem[lstItem];
            Assoc_Type = Assoc_Text.split('&')[0];
            Assoc_With = Assoc_Text.split('&')[1];
            Assoc_With_Left = Assoc_With.left(currModelName.length);        // added left functionality to string protoype

            if (Assoc_Type === "MTM") {
                // Determine if this model is the child or parent in the mtm association.
                // relies on convention in naming mtm associations in the model, 
                // assoc-with will be the child if it's left most characters matches the current model name
                if (currModelName === Assoc_With_Left) {     // this is the parent in the mtm relationship

                    //#region Add a button to view many to many children as a tooltip

                    Assoc_Btn_Text = Assoc_With.replace(new RegExp("_", "g"), " ") + 's';
                    Assoc_Child_Model = Assoc_With;
                    Assoc_Parent_Model = model;

                    // Add a button to add a many to many child
                    Add_Btn_Text = '+ ' + Assoc_With.replace(new RegExp("_", "g"), " ");      // 06-12-2017 - Add Audit Measure
                    var $btnAddMany = $('<input>', {
                        'class': "add_mtm btn btn-default btn-xs btn-block",
                        id: "rownum" + rowNum,
                        role: "button",
                        type: "button",
                        value: Add_Btn_Text
                    });

                    $btnAddMany.attr('data-child', Assoc_Child_Model);      // 06-12-2017 - Add Audit Measure
                    $btnAddMany.attr('data-parent', Assoc_Parent_Model);    // 06-12-2017 - Add Audit Measure
                    $btnAddMany.attr('data-id', key_value);                 // 06-12-2017 - Add Audit Measure
                    assocBtns.push($btnAddMany);                            // 06-12-2017 - Add Audit Measure

                    //#endregion    Add a button to view many to many children as a tooltip

                    //#region Add button to manage mtm children
                    var $btnManyToMany = $('<input>', {
                        'class': "manage_mtm btn btn-default btn-xs btn-block",
                        role: "button",
                        type: "button",
                        value: Assoc_Btn_Text,
                    });
                    $btnManyToMany.attr('data-child', Assoc_Child_Model);
                    $btnManyToMany.attr('data-parent', Assoc_Parent_Model);
                    assocBtns.push($btnManyToMany);
                    //#endregion

                    // If this is the first row, add a column header 
                    if (rowNum === 1) {
                        assocHdrs.push("Details");
                        assocHdrs.push("Actions");      // 06-12-2017 - Add Audit Measure
                    }
                        // Add to column header if this is the first row in the next page but not if it's a view all display
                    else if ((rowNum % takeRecordsConst === 1) && (!(returnedRecords > takeRecordsConst))) {
                        assocHdrs.push("Details");
                        assocHdrs.push("Actions");      // 06-12-2017 - Add Audit Measure
                    }
                }
                else {      // this is the child in the mtm relationship and we are building a manage mtm update modal
                    if (buildType === "MTM") {  // update (add or remove) mtm buttons are only added if building a page to manage mtm relationships
                        if (sessionStorage.userrole === "Admin" || sessionStorage.userrole === "TRACS_Admin") {   // don't show add and remove options if not in the admin or TRACS_Admin role
                            Assoc_Btn_Text = Assoc_With.replace(new RegExp("_", "g"), " ");
                            var $btnDetailsRemove = $('<input>', {
                                'class': "remove-from-parent btn btn-default btn-xs btn-block",
                                role: "button",
                                type: "button",
                                value: "Remove from " + Assoc_Btn_Text

                            });
                            assocBtns.push($btnDetailsRemove);

                            if (rowNum === 1) {
                                assocHdrs.push("Remove");
                            }
                        }
                    }
                }
            }
            else if (Assoc_Type === "OTM") {
                if (currModelName === Assoc_With_Left) {     // if this is the child in the otm relationship
                    Assoc_Btn_Text = Assoc_With.replace(new RegExp("_", "g"), " ") + 's';
                    Assoc_Child_Model = Assoc_With;
                    Assoc_Parent_Model = currModelName;
                    if (buildType === "MTM") {
                        var $btnBuildDetails = $('<input>', {
                            class: "show-children btn btn-default btn-xs btn-block",
                            role: "button",
                            type: "button",
                            value: Assoc_Btn_Text,
                            id: key_value
                        });
                        // if the parent in the OTM is in an MTM and has not been added to it's parent, disable the details button.
                        if (!data_mtm_added) {
                            $btnBuildDetails.prop("disabled", true);
                            $btnBuildDetails.css("background-color", "pink");
                        }

                        $btnBuildDetails.attr('data-child', Assoc_Child_Model);
                        $btnBuildDetails.attr('data-parent', Assoc_Parent_Model);
                        assocBtns.push($btnBuildDetails);

                        //16/05/2016 - if (rowNum === 1 || rowNum % takeRecordsConst === 1) {
                        if (rowNum === 1) {
                            assocHdrs.push("Details");
                        }
                    }
                }
            }
        }
    }
}

function buildDetailsModalMM($tr) {

    cleanUp();    
    $('#loader_mm').css('display', 'flex'); // show loader, hide datatable
    $('#table_data_mm').css('display', 'none');

    // disable elements that shouldn't be operative during data retrieval.
    $('.navbar-nav  > li > a, button, input, tr').addClass('disabledControl');

    var $parent_id = $($tr).attr('id');
    var $parent_model_name = $($tr).data('name');   // name on parent record
    var $parent_model = $($tr).data('parent');      // name of parent model
    var $child_model = $($tr).data('child');        // name of child model
    var $location = $($tr).data('location');        // parent location if available
    var jsDate = moment($($tr).data('audit-date'), "DD/MM/YYYY");
    var $parent_audit_year = jsDate.year();         // parent year if available   

    // Update the modal text with a combination of plain text and appended span tags
    // The span tags are appended so they can be styled - see h4 entry in TRACS.css
    var modalParentTitleText = $location ? $location + " " + $parent_model_name + " " + $parent_audit_year : $parent_model_name + " " + $parent_audit_year; // prepend the parent model name with location if it exists
    var modalChildTitleText = $child_model + 's';
    var modalTitleTextTemp = modalChildTitleText + " for: ";
    var modalTitleText = modalTitleTextTemp.replace(new RegExp("_", "g"), " ");
    $("#ModalTitle_mm").text(modalTitleText);   // caption on update modal
    var $parentTitle = $('<span/>', { text: modalParentTitleText.replace(new RegExp("_", "g"), " ") });
    $("#ModalTitle_mm").append($parentTitle);   // add span so we can style this element in TRACS.css - see h4 styling of span elements

    var urifinal = uriBaseConst + '/' + "details" + '/' + ($child_model + 's').toLowerCase() + '/' + $parent_id;
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

                var modelEval = "meta" + $child_model;
                var objModel = window[modelEval];   // eval(modelEval);   - Changed 03/05/2018 
                buildHeaderRow(objModel, "MTM");
                // Now build the table rows and cells for each returned model item           
                rowNum = 0;               
                for (var i = 0; i < data.length; i++) {         // $parent_id contains the key of the child records parent
                    buildDataRow(data[i], objModel, "MTM", $parent_id);
                }

                // part of code for expanding master/detail row
                $("#dataTable_mm tr:odd").addClass("master");
                $("#dataTable_mm tr:not(.master)").hide();
                $("#dataTable_mm tr:first-child").show();   // this shows the first row containing row headers
                // end of code block for expanding row

                $('#frmPaged').reset;       //formatRowsPagers(); commented out on 16/06/2017
                $('.navbar-nav  > li > a, button, input,tr').removeClass('disabledControl');
                $('#loader_mm').css('display', 'none');     // show datatable, hide loader
                $('#table_data_mm').css('display', 'block');
                $('#modalMTMUpdate').modal({ backdrop: 'static', keyboard: false });  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.
            }
        })
        .fail(function (jqXHR, textStatus, err) {
            errorCallback(jqXHR, textStatus, err, false);
        });
}

function buildDetailsModal($tr) {

    cleanUp();
    $('#table_data_details').css('display', 'none');

    $('.navbar-nav  > li > a, button, input, tr').addClass('disabledControl');  // disable elements that shouldn't be operative during data retrieval.

    var $parent_id = $($tr).attr('id');             // Id of the parent model's record e.g. Id of the Audit Measure when building audit measure assessment rows
    var $parent_model_name = $($tr).data('name');   // name on parent record
    var $parent_model = $($tr).data('parent');      // name of parent model
    var $child_model = $($tr).data('child');        // name of child model
    var $location = $($tr).data('location');        // parent location if available

    // Update the modal text with a combination of plain text and appended span tags
    // The span tags are appended so they can be styled - see h4 entry in TRACS.css
    var modalParentTitleText = $location ? $location + " " + $parent_model_name : $parent_model_name; // prepend the parent model name with location if it exists 
    var modalChildTitleText = $child_model + 's';
    var modalTitleTextTemp = modalChildTitleText + " for";
    var modalTitleText = modalTitleTextTemp.replace(new RegExp("_", "g"), " ");
    var $parentTitle = $('<span/>', { text: modalParentTitleText.replace(new RegExp("_", "g"), " ") });
    $("#title_details").text(modalTitleText);   // caption on update modal
    $("#title_details").append($parentTitle);

    var urifinal = uriBaseConst + '/' + "details" + '/' + ($child_model + 's').toLowerCase() + '/' + $parent_id;
    // Additional data sent with request ends up as querystring parameters ignored by routing, but used in message handling by ApiKeyHandler.
    $.getJSON(urifinal, "key=" + metaKey2)        
        .done(function (data, status, jqXHR) {

            returnedRecords = data.length;  // used in paging
            allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'

            var modelEval = "meta" + $child_model;
            var objModel = window[modelEval]; // eval(modelEval);   - Changed 03/05/2018
            buildHeaderRow(objModel, "Details");
            // Now build the table rows and cells for each returned model item 
            rowNum = 0;
            for (var i = 0; i < data.length; i++) {
                buildDataRow(data[i], objModel, "Details", $parent_id);
            }

            $('#frmPaged').reset;           
            $('.navbar-nav  > li > a, button, input,tr').removeClass('disabledControl');    // re-enable elements that shouldn't be operative during data retrieval.            
            $('#table_data_details').css('display', 'block');   // show datatable, hide loader
        })
        .fail(function (jqXHR, textStatus, err) {
            $('#title_details').empty();
            var $btnSelector = '#' + $parent_id + "." + "show-children";
            var $parentToClick = $($btnSelector);
            $parentToClick.click();
            errorCallback(jqXHR, textStatus, err, true);
        });
}

function callSynchronousAjax(Url) {
    // Note - Had to use an Ajax call here and set async to false, otherwise processing was getting out of order.
    return $.ajax({
        url: Url,
        type: 'GET',
        async: false,
        success: function (data, status, jqXHR) {
            if (data.CustomErrorMessage) {
             errorCallback(jqXHR, status, data.CustomErrorMessage ? data.CustomErrorMessage : "");             
            }
            return data;
        }
    }).fail(function (jqXHR, textStatus, err) {
        errorCallback(jqXHR, textStatus, err);
        return false; // exit the routine if a problems occurs.
    });
}

function fileRemoval() {
    if (!confirm('You\'re sure you want to remove the file?')) { return false; }    // prompt the user for confirmation of the file removal

    $("#modalUp").prop("disabled", true);  // disable the update button until successful return from the file removal operation.

    var $inputId = $(this).attr('data-audit-inputid');
    var $auditId = $(this).data('audit-id');
    var $removalFilePath = $(this).attr('data-removalFilePath');        // had to use this syntax to extract the data attribute for the button
    var $parentId = $("#modalUp").attr('data-parent_Id');               // Id of parent record

    $.ajax({
        url: 'api/fileupload/' + "?" + $.param({
            "key": metaKey2, "File-Operation": "Remove", "removalFilePath": $removalFilePath, "Audit-Model": model, "Parent-Id": $parentId, "Audit-Id": $auditId    // 07/05/2018 added parentId and auditId
        }),
        type: 'POST',
        processData: false,
        contentType: false,
        success: function (data, status, jqXHR) {
            $("#" + $inputId).val("No Evidence");

            // update the date the audit documentation was added/updated along with the Id of the logged in user.
            var $momentNow = moment(new Date()).format("DD/MM/YYYY");
            $("#" + "upAudit_Documentation_Date").val($momentNow);
            $("#" + "upAudit_Document_Employee_Id").val(sessionStorage.username);
            $("#" + "upAudit_Document_Action").val("Removed");

            // set properties for the doco anchor element on the update modal 
            var $docoAnchor = $('#upLoadAnchor' + $auditId);
            $docoAnchor.addClass('disabledControl');
            $docoAnchor.find('span').remove();  // remove the span containing the current glyphicon.
            var $glyphSpan = $('<span/>', {
                class: 'glyphicon glyphicon-remove'
            });
            $docoAnchor.append($glyphSpan);

            // new code for finalised flag
            $("#" + "upFinalised").val("false");    // applies to Audit model
            $("#" + "upCompleted").val("false");    // applies to Audit_Measure_Assessment model

            $("#" + "upDocoRemove").addClass("disabledControl");        // disable the remove button now there is no doco
            $('[data-dismiss]').addClass("disabledControl");            // make sure the user updates the record after a file operation by disabling any close modal controls
            $("#modalUp").prop("disabled", false);                      // re-enable the update button until successful return from the file copy operation.

            var $messages = $('#messages_details');
            $messages.css("display", "block").attr('class', 'message applicationmessage');
            $messages.html("The evidence has been removed from the server." + "</br>" + "Now update the record for the operation to be registered in TRACS");
        }
    }).fail(function (jqXHR, textStatus, err) {
        $("#modalUp").prop("disabled", true);
        alert("There has been a system error while removing the file.\nThe error message will be visible after clicking OK.");       
        errorCallback(jqXHR, textStatus, err, true);
    });
}

function fileInputChange() {

    $("#modalUp").prop("disabled", true);  // disable the update button until successful return from the file upload operation.

    var $id = $(this).attr('id');
    //var auditId = row.dataset.auditId;      // can do this, and is best practice. Note: the name of the data attribute has the hyphens removed e.g. audit-id becomes auditId

    var $auditId = $(this).data('audit-id');
    var $auditModel = $(this).data('audit-model');
    var $auditName = $(this).data('audit-name');
    var $parentAuditName = $(this).data('audit-parent-audit-name');
    var $campus = $(this).data('audit-campus').replace(new RegExp(" ", "g"), "_");
    var $auditLoc = $(this).data('audit-location').replace(new RegExp(" ", "g"), "_");
    var $auditType = $(this).data('audit-type');
    var $compArea = $(this).data('audit-compliance-area');
    var $inputId = $(this).data('audit-inputid');   // data attribute names have to be lower case
    var $auditDate = $(this).data('audit-date');
    var jsDate = moment($auditDate, "DD/MM/YYYY");
    var $auditYear = jsDate.year();
    var $assessment_due_date = $(this).data('assessment-due-date');

    var $filePath = "", $fileName = "";
    if ($parentAuditName) {
        $filePath = $compArea + "\/" + $parentAuditName + "\/" + $auditYear + "\/" + $campus + "\/" + $auditLoc + "\/" + $auditName;
        var momentDate = moment($assessment_due_date, "DD/MM/YYYY");   // turns $assessment_due_date into a moment date.
        $assessmentDueDate = momentDate.format("YYYY/MM/DD");        // use moment to reformat to YYYY/MM/DD
        $assessmentDueDate = $assessmentDueDate.replace(new RegExp("/", "g"), "_");
        $fileName = $assessmentDueDate + "_" + $auditName + "_" + $auditLoc + ".pdf";
    }
    else {
        $filePath = $compArea + "\/" + $auditName + "\/" + $auditYear + "\/" + $campus;
        $fileName = $auditYear + "_" + $auditName + "_" + $auditLoc + ".pdf";
    }

    var $dbFilePath = $auditType + "\/" + $filePath + "\/" + $fileName;     // audit type added as staeting folder... WHS/Clinical
    $dbFilePath = decodeURIComponent($dbFilePath);

    var formData = new FormData();
    // append file information for each file to a form data object
    $.each(this.files, function (obj, file) {
        formData.append($auditId, file);
    });

    $.ajax({
        url: 'api/fileupload/' + "?" + $.param({
            "key": metaKey2, "File-Operation": "Upload", "Audit-Type": $auditType, "Audit-Model": $auditModel, "Audit-Name": $auditName,
            "Audit-LOC": $auditLoc, "Audit-Year": $auditYear, "Audit-CA": $compArea, "Audit-Campus": $campus,
            "File-Path": $filePath, "File-Name": $fileName, "Parent-Audit-Name": $parentAuditName
        }),
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, status, jqXHR) {

            //var $btnModalUpdate = $("#modalUp");
            var newFilePath = jqXHR.getResponseHeader("filePath");  // the new filepath is included in the responses header.

            var $docoAnchor = $('#upLoadAnchor' + $auditId);        // the doco anchor element on the update modal                                                                
            $docoAnchor.attr("href", "file:" + newFilePath);        // the filePath returned from the web api file upload handler which adds it to the response headers                                                                         
            $docoAnchor.find('span').remove();                      // remove the span containing the current glyphicon.
            $docoAnchor.removeClass('disabledControl');             // this line is in place for the records previously without evidence where the doco anchor was disabled 

            //  setting the text attribute of $docoAnchor wipes out the tooltip span tag so recreate and append to $docoAnchor            
            var $glyphSpan = $('<span/>', {
                class: 'glyphicon glyphicon-file'
            });
            $docoAnchor.append($glyphSpan);
            var $toolSpan = $('<span/>', {
                text: newFilePath      // text: $fileLoc
            });
            $docoAnchor.append($toolSpan);

            $('[data-dismiss]').addClass("disabledControl");    // make sure the user updates the record after a file operation by disabling any close modal controls
            $("#modalUp").prop("disabled", false);              // re-enable the update button until successful return from the file copy operation.

            //  $("#" + $inputId) is the hidden input element on the update form associated with the doc for the audit. 
            //  This is what is passed for update to the d/b so update it to the latest value.             
            $("#" + $inputId).val($dbFilePath);

            // update the date the audit documentation was added/updated along with the Id of the logged in user.
            var $momentNow = moment(new Date()).format("DD/MM/YYYY");
            $("#" + "upAudit_Documentation_Date").val($momentNow);
            $("#" + "upAudit_Document_Employee_Id").val(sessionStorage.username);
            $("#" + "upAudit_Document_Action").val("Added");

            // new code for finalised flag
            $("#" + "upFinalised").val("true");    // applies to Audit model
            $("#" + "upCompleted").val("true");    // applies to Audit_Measure_Assessment model

            $("#" + "upDocoRemove").removeClass("disabledControl"); // re-enable the remove doco button
            $("#" + "upDocoRemove").attr('data-removalFilePath', newFilePath);  // add the new filepath to the remove doco button

            $messages = $('#messages_details');
            $messages.attr('class', 'message applicationmessage').css("display", "block");
            $messages.html("The evidence has been uploaded to the server." + "</br>" + "Now update the record for the evidence to be registered in the Database");
        }
    }).fail(function (jqXHR, textStatus, err) {
        $("#modalUp").prop("disabled", true);
        alert("There has been a system error while adding evidence.\nThe error message will be visible after clicking OK."); 
        errorCallback(jqXHR, textStatus, err, true);
    });    
}

function setHeader(xhr) {
    var d = new Date();
    var n = d.getTime();
    xhr.setRequestHeader('securityCode', n);
}

function formatRowsPagers() {

    rowNum = 0;

    // Applying conditional formatting to the page next and prev buttons.

    // Before applying logic, enable all paging buttons.
    // Then disable buttons as needed.
    var $this = $('#btnPageNext');
    $this.removeAttr('disabled').siblings('button').removeAttr('disabled');

    // if we are on the last page and not on a page boundary
    if (returnedRecords < takeRecords) {
        $this.attr('disabled', 'disabled');
        $('#btnPageLast').attr('disabled', 'disabled');
    }
    // if we are on the last page and on a page boundary
    if (skipRecords === (allRecords - takeRecords)) {
        $this.attr('disabled', 'disabled');
        $('#btnPageLast').attr('disabled', 'disabled');
    }
    // if we are on the first page
    $this = $('#btnPagePrev');
    if (skipRecords === 0) {
        $this.attr('disabled', 'disabled');
        $('#btnPageIst').attr('disabled', 'disabled');
    }
}

function errorCallback(jqXHR, textStatus, message, MTM, filterFail) {

    MTM = MTM || false;
    filterFail = filterFail || false;

    $('.loader').css('display', 'none');
    $('.table').css('display', 'block');
    $('.navbar-nav  > li > a, button, input,tr').removeClass('disabledControl');

    var $messages;
    if (MTM) {
        $messages = $('#messages_mm');   // messages div on MTM modal
    }
    else if (detailsUpdate) {
        $messages = $('#messages_details');    // messages div on update modal
    }    
    else {
        //$("[id^='modalDismiss']").click();  // Dismiss currently open modal - ^ -  jQuery selector for all elements with id beginning with 'modalDismiss'
        $messages = $('#messages');     // messages div on standard table display       
    }
    $messages.css('display','block').attr('class','message goodmessage');    

    if (typeof (jqXHR) !== "string" && textStatus == "success") {
        $messages.html(message);
    }
    else if (typeof (jqXHR) == "string" && textStatus == "success") {             
        $messages.html(message);
    }
    else if (typeof (jqXHR) === "string") {
        $messages.html(message);
    }
    else if ((jqXHR.hasOwnProperty("responseJSON"))) {
        if (typeof (jqXHR.responseJSON) === "string") {
            $messages.attr('class', 'message applicationmessage');            
            $messages.html("Application Error: " + jqXHR.responseJSON);
        }
        else if (typeof (jqXHR.responseJSON) === "object") { 
            $messages.html(ValidationCheckErrorResponse(jqXHR.responseJSON, $messages));
        }
    }
    else {
        if (jqXHR.responseText.search(/The resource you are looking for has been removed, had its name changed, or is temporarily unavailable/i) >= 0) {
            $messages.html("The requested Controller, Action or File was not found. <br/>Please contact the analyst programmer for CACS-GNS");
        } 
        else {
            $messages.html("There has been an unspecified error. <br/>Please contact the analyst programmer for CACS-GNS");
        }     
    }  
}

function ValidationCheckErrorResponse(response, $messages) {
    var errorString = "", serverMsg = "", customMsg = "";
    //var data = ValidationGetResponseObject(response);
    //if (response.hasOwnProperty("Data")) {
    //    $.each(data.Data.State, function (i, item) {
    //        $messages.attr('class', 'message badApplicationmessage');
    //        var itemName = item.Name.split('.')[1];
    //        errorString = 'An Validation error has occurred.' + '<br />' + "Error Message: ";
    //        var errorField = "</br>" + (itemName ? itemName + ": " : ""); // removes model name            
    //        errorString += errorField;
    //        $.each(item.Errors, function (j, errorItem) {
    //            errorString += errorItem;
    //        });
    //    });
    //    errorString = errorString.replace(new RegExp("_", "g"), " ");
    //    return errorString;
    //}
    if (response.hasOwnProperty("CustomErrorMessage")) {   // 14/05/2018 - Changed inline with introduction of an Exception Filter on the controllers
        $messages.attr('class', 'message goodmessage');
        errorString = response.CustomErrorMessage.replace(new RegExp('\n', "g"), '</br>');       
        return errorString;
    }   
    else if (response.hasOwnProperty("Message")) {
        $messages.attr('class', 'message badmessage');
        errorString = 'A System error has occurred.';
        serverMsg = response.Message.replace(/\n/g, '<br/>');
        errorString += '<br />' + "Error Message: " + '<br />' + "<span style='color:white'>" + serverMsg + "</span></br>" + "Please take a screen shot and contact the Webmaster.";
        return errorString;
    }    
    else return;
}

function getStoredData(modelObject, storedObject) {
    var retrievedObject = sessionStorage.getItem(modelObject);
    //var storedObject = JSON.parse(retrievedObject);
    var storedTempObject = JSON.parse(retrievedObject);
    $.each(storedTempObject, function (key, item) {
        storedObject[key] = item;
    });
}

function getMetaData(modelObject, varObject) {

    // Change to the routine on 23/02/2017
    // The server routine expects the model name to be the same as declared in the model i.e. First letter of each word capitalised and each word separated by underscores.
    // This routine changes the modelObject argument passed to this function to the form required by the server.
    // The function added to do the work is credited here: // this routine sourced here http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city

    var modelName = modelObject.replace(new RegExp("_", "g"), " ").toLowerCase();   // take the underscores out
    modelName = modelName.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); })     // Do the work
    modelName = modelName.replace(new RegExp(" ", "g"), "_");   // Put the underscores back in

    var uriMetaFinal = 'api/employees/metadata' + '/' + modelName;       // Routed to controller method example - 'api/employees/metadata/Location'
    $.getJSON(uriMetaFinal, "key=" + "star" + "&key2=" + "metadata")
        .done(function (data) {
            $.each(data, function (key, item) {
                varObject[key] = item;
            });
            // Place the object into session storage
            sessionStorage.setItem(modelObject, JSON.stringify(varObject));
        }).fail(function (jqXHR, textStatus, err) {
            errorCallback(jqXHR, textStatus, err);
        });
}

function getAssociations() {
    var uriMetaFinal = "api/foundations/manytomany";
    $.getJSON(uriMetaFinal, "key=" + "star" + "&key2=" + "metadata")
        .done(function (data) {
            $.each(data, function (key, item) {
                metaAssociations[key] = item;
            });
            sessionStorage.setItem("metaAssociations", JSON.stringify(metaAssociations));       // Put the object into storage
        }).fail(function (jqXHR, textStatus, err) {
            errorCallback(jqXHR, textStatus, err);
        });
}

function loadFTObjects(varObject) {
    // Populates an object with the corresponding table values in the model
    // The 'name' property has already been added to each of the collection objects when initialised
    //var d = new Date();
    //$('#debugLabel').append("Entering LoadFT_Objects for: " + varObject.name + " at " + d.toLocaleTimeString()  + "</br>");

    var tempname = varObject.name;
    finalURI = "api/employees/" + varObject.name + "s" + "/0" + "/0"; // Routed to Controller method example - api/employees/Audits/0/0
    $.getJSON(finalURI, "key=" + "star" + "&key2=" + "metadata")
        .done(function (data) {
            try {
                var varObjectKey = varObject.name + "_Id";

                //$.each(data, function (key, item) {
                //    varObject[item[varObjectKey]] = item.FullName; 
                //    // TRACS Hack for use in build of filtered location dropdown when campus has been selected.
                //    if (varObject.name == 'Location') {
                //        Location_Map[item[varObjectKey]] = { Name: item.FullName, Parent_Id: item.Campus_Id, Id: item[varObjectKey] }; // map object for location 
                //    }
                //});

                // replaced above with for..loop -  see this article jQuery Objects as Arrays at https://tutorialzine.com/2011/06/15-powerful-jquery-tips-and-tricks-for-developers
                for (var i = 0; i < data.length; i++) {
                    varObject[data[i][varObjectKey]] = data[i].FullName;
                    // TRACS Hack for use in build of filtered location dropdown when campus has been selected.
                    if (varObject.name == 'Location') {
                        Location_Map[data[i][varObjectKey]] = { Name: data[i].FullName, Parent_Id: data[i].Campus_Id, Id: data[i][varObjectKey] }; // map object for location 
                    }
                }

                sessionStorage.setItem(varObject.name, JSON.stringify(varObject));

            } catch (e) {
                var here = "We are here";
            }
        })
        .fail(function (jqXHR, textStatus, err) {
            var userMessage = "";
            var responseText = jqXHR.responseText;
            if (responseText) {
                var obj = JSON.parse(responseText);
                var message = obj.Message.replace(/\\n/g, '\n');
                userMessage = message + "\n" + "Please take a screen shot and contact the Site Administrator.";
            } else {
                userMessage = "There has been an unspecified system error." + "\n" + "Please take a screen shot and contact the Site Administrator.";
            }
            alert(userMessage);
        });
}

function cleanUp() {

    //$('#frmById')[0].reset();
    //$('#frmByName')[0].reset(); 
    // Changed to below as reset only resets to default values and doesn't touch hidden fields
    // css property 'outline' is what gives the big red ugly border for invalid input fields, set this to none
    // reset also removes the big red ugly border, but we are not using it.
    $('#frmById input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('').css("outline", "none");
    $('#frmByName input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('').css("outline", "none");

    // Had to add css for display:block at end because removing all classes and adding message class was not working.
    $('#messages, #messages_mm, #messages_details').empty().removeClass().addClass('message').css("display", "none");
}

// Delegated events attached to dynamically created elements....most of the web page apart from the modal login
// Design Principal - Delegated events must be attached to the nearest parent that is not dynamic i.e. existed at the time of attaching the handler.
// If you attach it to $(document),it has too may events to listen to and parse to see if it matches the descendent selector.

$(document.body).on("click", "#btnFindById", function () {
    // See notes about why checkValidity is being used here.
    $('#frmByName')[0].reset();
    gblStickyFilter = false;    // any type of find will always reset any filtering in place.
    var inpObj = document.getElementById("recordById");     // javascript required to select dom object. checkValidity() didn't work by jQuery Selection
    var $btnFindAll = document.getElementById('btnFindAll');    // hack in case of model name change from MTM screen
    model = $btnFindAll.dataset.model;

    if (inpObj.checkValidity()) {
        var id = $('#recordById').val();        
        $("#table_data > tbody,#table_data > thead").empty();
        var urlId;
        if (model == 'Audit' || model == 'Audit_Measure' || model == 'Audit_Measure_Task') {    // Massive hack in lieu of changing all compliances controllers to api/compliances
            urlId = 'api/compliances' + '/' + model.toLowerCase() + '/' + id;
        }
        else {
            urlId = uriBaseConst + '/' + model.toLowerCase() + '/' + id;
        }

        $.getJSON(urlId, "key=" + metaKey2)
            .done(function (data, status, jqXHR) {
                if (data.CustomErrorMessage) {  // not found from server                  
                    errorCallback(jqXHR, status, data.CustomErrorMessage);
                }
                else {
                    cleanUp();
                    $("#table_data > tbody,#table_data > thead").empty();
                    returnedRecords = 1;    // The controller returns a single entity only, data.length is not available.
                    allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'

                    // build  table rows and cells for each returned record
                    var modelEval = "meta" + model;
                    var objModel = window[modelEval];
                    buildHeaderRow(objModel, "Standard");
                    buildDataRow(data, objModel, "Standard");

                    formatRowsPagers();
                    skipRecords = 0;
                    takeRecords = takeRecordsConst;
                    //$('#recordById').focus();
                    //$("#navInfo").html("Showing record with Id " +id);
                    $('#messages').empty();
                }                
            })
            .fail(function (jqXHR, textStatus, err) {
                errorCallback(jqXHR, textStatus, err);              
            });
    }
});

$(document.body).on("click", "#btnFindByName", function () {
    $('#frmById')[0].reset();
    gblStickyFilter = false;    // any type of find will always reset any filtering in place.
    var inpObj = document.getElementById("recordByName");   // javascript required to select dom object. checkValidity() didn't work by jQuery Selection
    var $btnFindAll = document.getElementById('btnFindAll');    // hack in case of model name change from MTM screen
    model = $btnFindAll.dataset.model;

    if (inpObj.checkValidity()) {
        var name = $('#recordByName').val();
        // Massive hack in lieu of changing all compliances controllers to api/compliances
        var urlName;
        if (model == 'Audit' || model == 'Audit_Measure' || model == 'Audit_Measure_Task') {
            urlName = 'api/compliances' + '/' + model.toLowerCase() + '/' + name;
        }
        else {
            urlName = uriBaseConst + "/" + model.toLowerCase() + '/' + name;
        }

        $("#table_data > tbody,#table_data > thead").empty();

        $.getJSON(urlName, "key=" + metaKey2)
            .done(function (data, status, jqXHR) {
                if (data.CustomErrorMessage) {  // not found Aex from server                  
                    errorCallback(jqXHR, status, data.CustomErrorMessage);
                }
                else {
                    cleanUp();
                    returnedRecords = data.length;
                    allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'

                    // build  table rows and cells for each returned record

                    takeRecords = allRecords;   // for formatting pagers routine

                    var modelEval = "meta" + model;
                    var objModel = window[modelEval]; // eval(modelEval);   - Changed 03/05/2018   
                    buildHeaderRow(objModel, "Standard");
                    $.each(data, function (key, item) {
                        buildDataRow(item, objModel, "Standard");
                    });     // end looping over each data item --> $.each(data, function (key, item)

                    formatRowsPagers();
                    skipRecords = 0;
                    takeRecords = takeRecordsConst;

                    //$("#navInfo").html("Showing records starting with " + "\'" + name + "\'");
                    $('#messages').empty();
                }
            })
            .fail(function (jqXHR, textStatus, err) {
                errorCallback(jqXHR, textStatus, err);
            });
    }
});

$(document.body).on("click", "#btnFindAll", function () {
    cleanUp();
    skipRecords = 0; takeRecords = allRecords; rowNum = 0;
    gblStickyFilter = false;    // any type of find will always reset any filtering in place.
    //model = $('#btnFindAll').data("model");     // hack in case of model name change from MTM screen
    var $btnFindAll = document.getElementById('btnFindAll');    // hack in case of model name change from MTM screen
    model = $btnFindAll.dataset.model;
    skipTakeObjects();
});

$(document.body).on("click", "#btnFindPaged", function () {
    cleanUp();
    skipRecords = 0; takeRecords = takeRecordsConst; rowNum = 0;
    gblStickyFilter = false;    // any type of find will always reset any filtering in place.
    var $btnFindAll = document.getElementById('btnFindAll');    // hack in case of model name change from MTM screen
    model = $btnFindAll.dataset.model;
    skipTakeObjects();
});

$(document.body).on("click", "#btnAddRec", function () {
    cleanUp();
    var $btnFindAll = document.getElementById('btnFindAll');    // hack in case of model name change from MTM screen
    model = $btnFindAll.dataset.model;
    $("#modalUp").removeAttr("data-natural-key");
    $("#modalUp").removeData(); // removes jQuery internal cache of data elements
    buildInsertModal();
    $('#modalUp').text("Insert");
    //$("#modalUp").attr('data-insert', 'insert');    // informs updateRecord() this is an insert.    
    $('#modalUpdate').modal({ backdrop: 'static', keyboard: false });  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.
});

$(document.body).on('hidden.bs.modal', '#modalUpdate', function () {
    //$('#modalUpdate').on('hidden.bs.modal', function () {
    // Fires off on dismissing the update modal
    // massive fudge to workaround issue of stacked modals - will work on better solution later
    // if the update modal being dismissed is for a child detail row, and there is a parent modal that has been hidden, show the parent modal 

    if (detailsUpdate) {
        $("#modalMTMUpdate").toggle();
        detailsUpdate = false;
    }
    else if (standardUpdate) {
        standardUpdate = false;
    }
});

$(document.body).on('shown.bs.modal', '#modalUpdate,#modalLogin,#modalChangePassword', function () {
    // set focus to the Ist enabled and visible input field on Insert/Update that is not a datapicker field
    $("p input:enabled:visible:first:not(.hasDatepicker)").focus();
    if (onLoginModal) {
        if (userNameX) {
            $('#lgnPassword').focus();
        }
    }
});

$(document.body).on("click", "#tbody_data_mm .show-children", function () {

    //$(".show-children").removeClass("show-children-updated");   // remove highlighting of the child record just updated

    var $tr = $(this).closest('tr');                // $tr is the current row where the details buttons are located   

    // highlighting of parent row
    $tr.siblings("#tbody_data_mm tr:not(.master)").removeClass("parent_row_clicked");   // blanket removal of the parent row highlighting
    if (!$tr.is("parent_row_clicked")) {
        $tr.addClass("parent_row_clicked");
    }

    //var $tr_detail_id = $tr.next("tr").attr("id");  // this is the id of the hidden details row, setup in BuildDataRow
    var $tr_detail = $tr.next("tr");                // this is the hidden child/details row to expand

    var $td_container = $tr_detail.find('td:first');    // this is the first td (td container ) in the child/details row
    $td_container.empty(); // for subsequent clicks of the show details button

    if ($tr_detail.is(":visible")) {
        $tr_detail.hide("fast");
        //$tr_detail.slideUp("slow","linear");
        $tr.removeClass("parent_row_clicked");
    }
    else {

        $tr.siblings("#tbody_data_mm tr:not(.master)").hide();      // start off by hiding all currently open detail rows

        var $parent_id = $($tr).attr('id'); //  this is the parent id of the details row
        var $child = $(this).data("child"); // 'this' is the button pressed
        var $parent = $(this).data("parent");
        $tr.attr('data-child', $child);
        $tr.attr('data-parent', $parent);

        var $td_container_id = $td_container.attr("id");    // this is the id of the td container

        var $divDT = $('<div>', {
            class: "table-responsive",
            id: "divTable_data_details",
            'style': 'width:100%;'
        });

        var $titleDT = $('<h4>', {
            id: "title_details"
        });
        $divDT.append($titleDT);

        var $detDT = $('<table>', {
            'class': "table table-striped table-condensed table-hover",
            id: "table_data_details",
            'style': 'width:100%;'
        });
        var $thead = $('<thead/>');
        $detDT.append($thead);
        var $tbody = $('<tbody>', {
            id: "tbody_data_details",
        });
        $detDT.append($tbody);
        $divDT.append($detDT);

        $td_container.append($divDT);   // add the dynamically created details datatable to the first td of the details row

        buildDetailsModal($tr);         // build the rows of the details datatable
        $tr_detail.show("fast");
        //$tr_detail.slideDown("slow", "linear");
    }
});

$(document.body).on("click", "#table_data tbody .manage_mtm", function () {

    var $child = $(this).data("child");
    var $parent = $(this).data("parent");
    var $tr = $(this).closest('tr');    //  Currently selected row
    $tr.attr('data-child', $child);
    $tr.attr('data-parent', $parent);

    buildDetailsModalMM($tr);
    // moved to success callback after successful retrieval of child mtm records
    //$('#modalMTMUpdate').modal({ backdrop: 'static', keyboard: false});  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.

});

$(document.body).on("click", "#table_data tbody .add_mtm", function () {

    cleanUp();  // added 12/01/2018 to clear old error messages

    var $child = $(this).data("child");
    var $parent = $(this).data("parent");
    var $parentId = $(this).data("id");
    var $tr = $(this).closest('tr');        //  Currently selected row
    $tr.attr('data-child', $child);         //  all data-* are later added to update/insert button in buildUpdateModal();
    $tr.attr('data-parent', $parent);
    $tr.attr('data-parentid', $parentId);
    model = $child;

    $tr.attr('data-pathway', 'Adding mtm ' + model);
    var modelText = model.replace(/([a-z])([A-Z])/g, '$1 $2');  // Caption on update modal changed to 'add' in this pathway to add a mtm  child
    $("#ModalTitle").text("Add " + modelText.replace(new RegExp("_", "g"), " "));
    $('#modalUp').text("Add Measure");   // button text on update modal changed to 'insert' for this pathway    
    buildUpdateModal($tr);  // returns here if failure  
});

$(document.body).on("click", "#table_data_mm tbody .remove-from-parent", function () {

    // 22/12/2017 - Added prompt 
    if (!confirm('Are you sure you want to remove the Audit Measure?')) { return false; }    // prompt the user for confirmation of the removal


    var $tr = $(this).closest('tr');    //  Currently selected row
    var $child_id = $($tr).attr('id');
    var $parent_id = $($tr).data('parent_id');

    var uriFinal = uriBaseConst + '/' + "details" + '/' + "audit_measures" + '/' + $parent_id + '/' + $child_id;

    $.ajax({
        url: uriFinal + "?key=" + metaKey2,
        type: 'DELETE',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        beforeSend: setHeader,
        success: function (data, jqXHR) {
            $("[id^='modalDismiss']").click();
            // After the modal is dismissed, the parent table is available - simulate click event on the row with the id of parent id to rebuild the mtm modal
            $('#' + $parent_id + ' .manage_mtm').click();
            if (data.CustomErrorMessage) {
                //var $messages = $('#messages_mm');
                //$messages.css('display', 'block').attr('class', 'message goodmessage');
                //$messages.html(data.CustomErrorMessage);
                errorCallback(jqXHR, status, data.CustomErrorMessage? data.CustomErrorMessage: databaseOperation,true);
            }
        }
    }).fail(function (jqXHR, textStatus, err) {
        errorCallback(jqXHR, textStatus, err, true);
    });

});

$('#table_data tbody').on("click", ".delete", function () {
    // Inactivate button deliberately disabled until we figue out what to do with inactivate process
    cleanUp();
    var $Name = $(this).closest('tr').data('name');     // Set up as the data-name attribute when the table row is created.
    var $Id = $(this).closest('tr').attr('id');         // Set up as the row Id when the table row is created.
    var urlId = uriBaseConst + '/' + model.toLowerCase() + '/' + $Id;
    $('#modalConfirm .modal-body p').html("Are you sure you wish to Inactivate " + model.replace("_", " ") + " " + '<b>' + $Name.toUpperCase() + '</b>' + ' ?');
    // Show the modal confirmation of delete dialogue
    $('#modalConfirm').modal({ backdrop: 'static', keyboard: false })
        .one('click', '#confirmDelete', function (e) {
            $.ajax({
                method: 'Delete',
                url: urlId + "?" + $.param({ "key": "1", "key2": "walloping", "key3": "bushwacker" }),
                // data: { }
                //data: "key=1&key2=walloping&key3=bushwacker"
            }).done(function (data, status, jqXHR) {

                returnedRecords = 1;    // The controller returns a single entity only, data.length is not available.
                allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All'

                // build  table rows and cells for each returned record
                skipRecords = 0;
                takeRecords = takeRecordsConst;
                skipTakeObjects();
                $('#messages').toggleClass('goodmessage');
                $('#messages').html('The record has been deleted');
            })
            .fail(function (jqXHR, textStatus, err) {
                errorCallback(jqXHR, textStatus, err);
            });
        });

});

$(document.body).on("keyup", "#frmUpdate [id$='Name']", function () {
    // This event listener is for the 'key up' event for name fields on the add/update modal.
    var firstName = $("#upEmployee_First_Name").val() ? $("#upEmployee_First_Name").val() : $("#upUser_First_Name").val();
    var lastName = $("#upEmployee_Last_Name").val() ? $("#upEmployee_Last_Name").val() : $("#upUser_Last_Name").val();
    $('#upEmployee_Email').val(firstName + '.' + lastName + '@' + 'hnehealth.nsw.gov.au');
    $("#upUser_Email").val(firstName + '.' + lastName + '@' + 'hnehealth.nsw.gov.au');
});

$(document.body).on("change", "#frmUpdate input,#frmChangePassword input", function () {
    // Delegated event to handle the fact that
    // 1. CSS does not handle ::after for input and select elements but jQuery .after() method does
    // 2. The .after() method is applied dynamically in buildInsertModal and buildUpdateModal to invalid input elements
    // 3. Dynamically trying to remove the .after() element doesn't work, because it is not technically part of the DOM.
    // So on change of an input field, perform a validation test and remove the next element if valid, in this case the * previously added to invalid elements

    $('#messages_details').empty();     // removes the date error handling messages
    $('#messages_details').attr('class', 'message');
    $("#frmUpdate input:valid,#frmChangePassword input:valid").next("span").hide();
    $("#frmUpdate input:invalid,#frmChangePassword input:invalid").next("span").show();
});

$(document.body).on("change", "#frmUpdate select", function () {
    // Handled differently to styling valid/invalid input elements above but same reasoning applies.
    var optionSelected = $("option:selected", this).index();
    if (optionSelected !== 0) {
        $(this).next("span").hide();
    }
    else {
        $(this).next("span").show();
    }
});

$(document.body).on("change", "#frmUpdate input[type=checkbox]", function () {
    // Routine to handle toggling on and off of checkboxes.
    // set the value of the input element containing the checkbox based on checked status.
    this.value = this.checked ? "1" : "0";
});

$(document.body).on("click", "tbody tr .update", function () {
    standardUpdate = true;
    cleanUp();
    // Populate the form from data attribute values attached to the update button while building the row.
    // Note: employee id and timestamp are displayed in label fields.
    // Note: .data handler - jQuery handler for getting and setting HTML5 data attributes.
    var $tr = $(this).closest('tr');    //  Currently selected row
    var $model = $(this).data("model");
    $tr.attr('data-model', $model);
    $("#modalUp").removeAttr("data-natural-key");    // could be artifact from previous insert
    $("#modalUp").removeData(); // removes jQuery internal cache of data elements
    buildUpdateModal($tr);
    $('#modalUp').text("Update");   
    $('#modalUpdate').modal({ backdrop: 'static', keyboard: false });  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.
});

$(document.body).on('click', '#table_data tbody tr', function () {  //Working - had to add the !important attribute to the style rule    
    $(this).addClass("tr_Selected").siblings().removeClass("tr_Selected");
});

$(document.body).on("click", "#btnPagePrev", function () {
    skipRecords = skipRecords - takeRecords;
    rowNum = skipRecords;
    skipTakeObjects();
});

$(document.body).on("click", "#btnPageNext", function () {
    skipRecords = skipRecords + takeRecords;
    rowNum = skipRecords;
    skipTakeObjects();
});

$(document.body).on("click", "#btnPageLast", function () {
    // When finding the last page, skipRecords will be the product of takeRecords and (allRecords/takeRecords rounded down)
    // If the number of records is divisble by takerecords, we have hit a page boundary.
    (allRecords % takeRecords === 0) ?   // modulus % operator
        skipRecords = ((allRecords / takeRecords) * takeRecords) - takeRecords
        :
        skipRecords = (Math.floor(allRecords / takeRecords)) * takeRecords;
    rowNum = skipRecords;
    //skipTakeEmployees();
    skipTakeObjects(); // Extract the records based on the action requested
});

$(document.body).on("click", "#btnLogin", function () {
    var inpObj = $('#frmLogin')[0]; // check the validity of the form based on HTML 5 validation attributes.   
    $('#btnLogin,#btnLoginCancel').addClass('disabledControl');
    if (inpObj.checkValidity()) {
        $.ajax({
            //url: "api/employees/login" + '/' + $('#lgnUserName').val() + '/' + $('#lgnPassword').val() + "?key=" + "employees",
            url: "api/employees/login" + '/' + $('#lgnUserName').val() + "?key=" + "employees",
            type: 'GET',
            cache: false,
            //contentType: 'application/json;charset=utf-8',
            //dataType: "json",
            beforeSend: function (request) {
                // send multiple custom headers in the request.
                var d = new Date();
                var n = d.getTime();
                request.setRequestHeader('securityCode', n);
                request.setRequestHeader("bettle", $('#lgnUserName').val());
                request.setRequestHeader("bettleA", $('#lgnPassword').val());
            },
            success: function (data, jqXHR) {
                // data - contains the data returned from the server
                // status - contains a string containing request status
                // jqXHR - contains the XMLHttpRequest object
                blnLgnSuccess = true;
                onLoginModal = false;
                sessionStorage.lgnSuccess = true;
                sessionStorage.username = $('#lgnUserName').val();
                // the data returned is an anonymous type returned by IHttpActionResult and containing role, base share and session id.
                sessionStorage.userrole = data.Role;
                sessionStorage.baseShareLoc = data.baseShareLoc;
                sessionStorage.beetle = data.beetle;
                sessionStorage.defaultPosition = data.defaultPosition;
                var appRegion = data.appRegion;
                sessionStorage.appRegion = data.appRegion;
                if (appRegion === "Development") {
                    var $h1 = $('#header h1:first-of-type').css('color', 'rgb(182,255,0)');
                }
                $('#appRegion').html("<span>Application Region - </span>&nbsp;&nbsp;" + appRegion);
                if (appRegion === "Production") {
                    $('#lgnUserName').val("");  // remove temporary defaults
                    $('#lgnPassword').val("");  // remove temporary defaults
                }
                metaKey2 = data.beetle;

                // Part of the attempt to set the identity for role based authorisation
                // This will set header values for all future ajax calls
                // 
                //$.ajaxSetup({
                //    headers: {
                //        'bettle': sessionStorage.username,
                //        'role': sessionStorage.role
                //    }
                //});

                $('#btnPagePrev').attr('disabled', 'disabled');
                var $btnFindAll = document.getElementById('btnFindAll');
                $btnFindAll.setAttribute('data-model', model);  //stores the name of the main parent model in a data attribute field. this was being lost in various workflows.
                $('a[href="#' + model + 's"]').click(); // Can be coming from Foundations or Audits page, so simulate click on the corresponding menu item. 
                $("#btnLoginCancel").click();           // close the login modal by firing a click event on the dismiss button.
            },
            error: function (jqXHR, textStatus, err) {
                $('#lgnMessages').html("");
                sessionStorage.setItem("lgnAttempts", parseInt(sessionStorage.lgnAttempts) + 1);
                if (sessionStorage.lgnAttempts > 4) {
                    $('#frmLogin')[0].reset();
                    $('#lgnMessages').html("You have exceed the permitted number of login attempts.<br>You will be redirected to the CACS GNS Portal.");
                    alert("You have exceeded the permitted number of login attempts \n and are being redirected to the CACS GNS Portal");
                    // simulate cancel click after 1 second
                    setTimeout(function () {
                        $("#btnLoginCancel").click();
                    }, "1000");
                }
                $('#lgnMessages').addClass("badMessageLogin");
                if (err === "Forbidden") {      // message from login controller that checks login usernames
                    $('#lgnMessages').html("There is a problem with the API key </br> Please call the Senior Analyst for CACS-GNS");
                    $('#lgnUserName').focus();
                    $('#btnLogin, #btnLoginCancel').removeClass('disabledControl');
                }
                else if (err === "Not Found") {       // IHttpActionResult from MessagesHandlers.cs                  
                    $('#lgnMessages').html("The Username is incorrect.");
                    $('#btnLogin, #btnLoginCancel').removeClass('disabledControl');
                }
                else if (err === "Unauthorized") {   // IHttpActionResult from the controller that checks logins 
                    $('#lgnMessages').html("The Password is incorrect.");
                    $('#btnLogin, #btnLoginCancel').removeClass('disabledControl');
                }
                else if (err === "Internal Server Error") {    // IHttpActionResult from the controller that checks logins 
                    alert("There was an Internal Server Error validating your API key" + "\n" + jqXHR.responseText);
                    $('#btnLogin, #btnLoginCancel').removeClass('disabledControl');
                    $('#lgnMessages').html("A serious error has occured on the web server. </br> Please call the Senior Analyst for CACS-GNS.</br>" + textStatus + "</br>" + err + "</br>" + jqXHR.responseText);
                }
                else {
                    alert("There was a Severe Error validating your API key." + "\n" + jqXHR.responseText + "Please call the Senior Analyst for CACS-GNS.");
                    setTimeout(function () {
                        $("#btnLoginCancel").click();
                    }, "1000");
                }
            }
        });
    }
    else {  // only goes here if fails HTML5 checkValidity()
        sessionStorage.setItem("lgnAttempts", parseInt(sessionStorage.lgnAttempts) + 1);
        if (sessionStorage.lgnAttempts > 4) {
            $('#btnLogin,#btnLoginCancel').addClass('disabledControl');
            $('#frmLogin')[0].reset();
            $('#lgnMessages').addClass("badMessageLogin");
            $('#lgnMessages').html("You have exceed the permitted number of login attempts.<br>You will be redirected to the CACS GNS Portal.");
            alert("You have exceeded the permitted number of login attempts \n and are being redirected to the CACS GNS Portal");
            // simulate cancel click after 1 seconds
            setTimeout(function () {
                $("#btnLoginCancel").click();
            }, "1000");
        }
    }
});

$(document.body).on("click", "#btnLoginCancel", function () {
    $('#frmLogin')[0].reset();
    if (!blnLgnSuccess) {
        //window.location.replace(hostURL);
        var path = window.location.pathname;
        var page = path.split("/").pop();
        var siteTemp = path.split(page)[0];
        var site = siteTemp.replace(new RegExp("/", "g"), "");
        document.location.href = hostURL + site + "/" + "Index.html";
    }
});

$(document.body).on("click", "#modalUp", function () {
    var inpObj = $('#frmUpdate')[0];   

    if (!inpObj.checkValidity()) {  // check the validity of the form based on HTML 5 validation attributes.   
        return;                     // keeps user on the update modal if validation fails
    }
        
    updateRecord();
});

$(document.body).on("click", '.nav.navbar-nav .dropdown-menu li a', function () {

    if ($(this).prop("id")) {   // Id property is only set for menu items when opening another html page. In that case, exit this function
        if ($(this).prop("id") === 'Admin') {
            return;
        }
    }

    var $href = $(this).attr('href');

    if ($href.left(5) == "#Open") { // this is a fancy function menu item. Exit the routine,keeping the current model as is.
        return;
    } else if ($href.left(7) == "#Create") {    // The Create User menu item under Admin has been selected
        $('a[href = "#Users"]').click();
        $('#btnAddRec').click();
        return;
    }

    model = $href.left($href.length - 1).replace('#', "");

    var $btnFindAll = document.getElementById('btnFindAll');
    $btnFindAll.setAttribute('data-model', model);

    // keep current skip/take settings if coming from an update dialogue
    if (upDateBool == true) {
        upDateBool = false;
    }
    else {
        skipRecords = 0;
        takeRecords = takeRecordsConst;
    }

    skipTakeObjects();

    var entityText = model.replace(/([a-z])([A-Z])/g, '$1 $2'); // finds each occurance of a lower case character followed by an upper case character, and inserts a space between them e.g. CostCentre to Cost Centre
    $('#entityLabel').text((entityText.replace(new RegExp("_", "g"), " ") + "s").padRight(20, " "));
    if (model !== 'Audit') {
        $('a.reportsFilter').css('visibility', 'hidden');    // hide the reports glyph if not on Audits screen.
    } else {
        $('a.reportsFilter').css('visibility', 'visible');
    }

});

$(document.body).on("click", ".refresh", function () {
    killBill = false;
    location.reload();
});

$(document.body).on("click", ".logout", function () {

    // Note: The jQuery unLoad() event is called when the window is closed by this routine     

    killBill = true;    // setting this flag will run the kill session code on the server when the unLoad() jQuery is called

    sessionStorage.removeItem("lgnSuccess");
    $('#frmLogin')[0].reset();

    var path = window.location.pathname;
    var page = path.split("/").pop();
    var siteTemp = path.split(page)[0];
    var site = siteTemp.replace(new RegExp("/", "g"), "");
    //document.location.href = hostURL + site + "/" + "Index.html";
    var httpPath = hostURL + site + "/" + "Index.html";

    var win = window.open(httpPath, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }

    setTimeout(window.open('', '_self').close(), 10);       // this syntax to close the window stops the browser prompting the user for confirmation. 

});

$(document.body).on("click", ".toPortal", function () {

    // Note: The jQuery unLoad() event is called when the window is closed by this routine     

    killBill = false;    // setting this flag to false will avoid the call to kill the session on the server when the unLoad() jQuery is called

    var path = window.location.pathname;
    var page = path.split("/").pop();
    var siteTemp = path.split(page)[0];
    var site = siteTemp.replace(new RegExp("/", "g"), "");
    //document.location.href = hostURL + site + "/" + "Index.html";
    var httpPath = hostURL + site + "/" + "Index.html";

    //var win = window.open('http://wdhcaren006/GNS_CACS/Index.html', '_blank');
    var win = window.open(httpPath, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }

    setTimeout(window.open('', '_self').close(), 10);       // this syntax to close the window stops the browser prompting the user for confirmation. 

});

window.onerror = function (errorMsg, url, lineNumber) {
    alert('Global Window Error Routine called: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};

$(document.body).on("click", ".nav li > a", function () {
    // Code block to fix 2 issues with the bootstrap menu not assigning the active class properly.
    // 1. The Ist item in the list was retaining the active class
    // 2. Subsequent items in the list were not been assigned the active class when clicked.

    $('.nav li').removeClass('active');
    $(this).parent().addClass('active');

});

$(document.body).on("click", ".changePassword", function (e) {
    e.preventDefault();     // goes on a road to nowhere if this is not included

    $("#frmChangePassword input").next("span").remove();
    $("#frmChangePassword select").next("span").remove();

    $("#frmChangePassword input").not('[disabled]').after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");

    $('#frmChangePassword')[0].reset()
    var userName = sessionStorage.username;
    $("#changeUserName").val(userName);

    var $messages = $('#changePasswordMessages');
    $messages.empty().removeClass().addClass('message').css("display", "none");

    $('#modalChangePassword').modal({ backdrop: 'static', keyboard: false });

});

$(document.body).on("click", "#btnChangePassword", function () {
    var inpObj = $('#frmChangePassword')[0]; // check the validity of the form based on HTML 5 validation attributes.   

    if (inpObj.checkValidity()) {

        $("#btnResetCancel,#btnReset").prop("disabled", true);

        if ($('#newPassword').val() != $('#confirmPassword').val()) {
            isStupid = true;
            alert("The new password and confirm password fields must be the same.");
            return;
        };

        var objChangePassword = {};
        objChangePassword['userName'] = $("#changeUserName").val();
        objChangePassword['currPassword'] = $('#currPassword').val();
        objChangePassword['newPassword'] = $('#newPassword').val();

        var DTO = JSON.stringify(objChangePassword);

        $.ajax({
            url: 'api/changePassword/' + "?" + $.param({
                "key": metaKey2
            }),
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            data: DTO,
            beforeSend: setHeader,
            success: function (data, status, jqXHR) {
                if (data.CustomErrorMessage) {
                    var message = data.CustomErrorMessage.replace(/\\n/g, '<br/>');
                    var $messages = $('#changePasswordMessages');
                    $messages.css({ 'width': '300px', 'color': 'black', 'border': '1px solid gray', 'font-weight': 'bold', 'padding': '3px', 'display': 'block', 'background-color': 'white' });
                    $messages.html(message);
                    $("#btnChangePasswordCancel,#btnChangePassword").prop("disabled", false);
                } else {
                    $("#btnChangePasswordCancel,#btnChangePassword").prop("disabled", false);
                    $("#btnChangePasswordCancel").click();
                    alert("The request to change your password has succeeded.");
                }
            }
        }).fail(function (jqXHR, textStatus, err) {
            var responseText = jqXHR.responseText;
            var userMessage = "";
            if (responseText) {
                var obj = JSON.parse(responseText);
                var message = obj.Message.replace(/\\n/g, '\n');
                userMessage = message + "\n" + "Please take a screen shot and contact the Site Administrator.";
            } else {
                userMessage = "There has been an unspecified system error." + "\n" + "Please take a screen shot and contact the Site Administrator.";
            }
            alert(userMessage);
            //$("#btnChangePasswordCancel").click();
        });
    }
});

// Blurb about UTC date treatment

// Following code block deals with the fact that, when stringifying dates, JSON stringify converts the date passed into the current UTC equivalent.
// This is in order to return a UTC datetime. 
// Therefore, for timezones ahead of UTC (or GMT),  what stringify does to a date for AEST is subtract 10 or 11 hours off it.                
// e.g. If "13/07/2016" gets passed into stringify as Wed Jul 13 2016 00:00:00 GMT+1000 (AUS Eastern Standard Time)
//      - when stringified, it ends up with the timezone offset added (plus -10) subtracted, which pushes it back into the previous day.
// Therefore, find out the timezone offset for the passed form date - this varies according to whether the form date falls in daylight saving or not.
// Then add the positive form of the offset to the form date. 
// For AEST this will be 10 or 11 hrs, depending on whether the form date is in daylight daving or not.
// When stringified, it will subtract the offset from the new frmDate dateTime to arrive at @fromDate: 00:00:00                            

// Old method based on the above, HOWEVER, I found a way using moment.utc to avoid all of this painful palava.
//var momentDate = moment.utc(frmDate, "DD/MM/YYYY");    // from moment.js - creates moment date object - deals with dates in various formats
//var jsDate = momentDate.toDate();                  // from moment.js - create javascript date from moment date object

//// get the timezone offset for javaScript Date
//// timezone offset always returns a negative number for Australian EST, so multiply by -1 to get the postive offset.
//var offset = (jsDate.getTimezoneOffset()) / 60 * -1;
//momentDate.add(offset, "hours");    // add the offset to the form date using moment.js;                
//var jsDateFinal = momentDate.toDate();   // convert the result to a javascript date which will later be stringified. 
//objForUpdate[field] = jsDateFinal;
//var test = jsDate.toISOString();

// End blurb about UTC date treatment

// using moment.js treats the given date as the UTC date, and returns the local equivalent i.e. with the timezone offset added
// So 19/08/2016 with no time returns Sat Aug 19 2017 10:00:00 GMT+1000 (AUS Eastern Standard Time).
// This is because at utc Sat Aug 19 2017 00:00:00 is actually a local tinme of Sat Aug 19 2017 10:00:00 GMT+1000 
//var jsDate = moment.utc(frmDate, "DD/MM/YYYY").toDate();

//$(".modal").draggable({  // Make modals draggable - jQuery-UI
//    handle: ".modal-content"
//});
//$('#navInfo').fadeIn({
//    duration: 3000,
//    step: function (now) {
//        //alert(now);
//    },
//    complete: function () { }
//});

//var path = window.location.pathname;
//var page = path.split("/").pop();
//var siteTemp = path.split(page)[0];
//var site = siteTemp.replace(new RegExp("/", "g"), "");

//// keep this in case 'contains' is deprecated in jQuery as it has been in CSS3.                   
//var $docoCompleted = $tr.children("td").filter(function () {  // return td's for AM rows with all the doco for child assessments uploaded
//    return $(this).text() == "Yes";
//});
//$docoCompleted.css({ 'background-color': 'lightgreen', font: 'bold' });

//var objAccessReq = {};
//objAccessReq['userName'] = $('#regUserName').val();
//objAccessReq['firstName'] = $('#regFirstName').val();
//objAccessReq['lastName'] = $('#regLastName').val();
//objAccessReq['email'] = $('#regEmail').val();
//objAccessReq['appReq'] = $('#regAppReq option:selected').text()

//var queryKeyEncoded = btoa("star");
//var queryKey2Encoded = btoa("accessRequest");
//var DTO = JSON.stringify(objAccessReq);

//$.ajax({
//    url: 'api/userRequest/' + "?" + $.param({
//        "key": "star", "key2": "accessRequest"
//    }),
//    type: 'POST',
//    contentType: 'application/json;charset=utf-8',
//    data: DTO,
//    success: function (data, status, jqXHR) {
//        $("#btnRegisterCancel").click();
//        alert("Your're request has been successfully sent\n to the Site Administrator for review.\n You will be notified by email of the outcome.");
//    }
//}).fail(function (jqXHR, textStatus, err) {
//    var responseText = jqXHR.responseText;
//    var userMessage = "";
//    if (responseText) {
//        var obj = JSON.parse(responseText);
//        var message = obj.Message.replace(/\\n/g, '\n');
//        userMessage = message + "\n" + "Please take a screen shot and contact the Site Administrator.";
//    } else {
//        userMessage = "There has been an unspecified system error." + "\n" + "Please take a screen shot and contact the Site Administrator.";
//    }
//    alert(userMessage);
//    $("#btnRegisterCancel").click();
//});

// Note - Had to use an Ajax call here and set it to async, otherwise processing was getting out of order.
//$.ajax({
//    url: "api/compliances/audit_measure_tasks/" + $parentComplianceArea + "/" + $parentAudit + "?key=" + metaKey2,
//    type: 'GET',
//    async: false,
//    success: function (data, status, jqXHR) {
//        allRecords = jqXHR.getResponseHeader("X-Paging-TotalRecordCount");  // this is populated in the controller get method and used by 'View All' 
//        var $messages = $('#messages');
//        $messages.css('display', 'block');
//        $messages.attr('class', 'message');
//        if (data.CustomErrorMessage) {   // set in controller for a successful response with message
//            var userMsg = "Completed successfully with a message.";
//            userMsg = userMsg + "\n" + data.CustomErrorMessage;
//            $messages.html(userMsg.replace(new RegExp('\\n', "g"), '</br>'));                           
//            return false;
//        }

//        Object.keys(objCollClone).forEach(function (key) {
//            if (data.indexOf(key) == -1) delete objCollClone[key]   // if the FT object key is not in the set returned, delete the key
//        });
//        objFT = objCollClone;
//    }
//}).fail(function (jqXHR, textStatus, err) {
//    $("#modalDismiss").click();
//    errorCallback(jqXHR, textStatus, err);
//    return false; // exit the routine if a problems occurs.
//});
//$(document.body).on('dblclick', '#table_data tbody tr:not(.reportsTR)', function () {
//    cleanUp();
//    // Populate the form from data attribute values attached to the update button while building the row.
//    // Note: employee id and timestamp are displayed in label fields.
//    // Note: .data handler - jQuery handler for getting and setting HTML5 data attributes.
//    //var Id = $(this).closest('tr').attr('id'); // table row ID   
//    buildUpdateModal(this);
//    $('#modalUp').text("Update");
//    $('#modalUpdate').modal({ backdrop: 'static', keyboard: false });  // Show the update modal with options set to prevent the user from clicking the background or hitting escape to close the modal.
//});

//$(document.body).on("click", ".register", function (e) {
//    e.preventDefault();     // goes on a road to nowhere if this is not included

//    //#region Stuff to deal with adding and resetting the red asterix at end of input and select fields    

//    $("#frmRegister input").next("span").remove();
//    $("#frmRegister select").next("span").remove();  

//    // Add a red colored * after every input element that does not have a disabled attribute set i.e the key fields
//    $("#frmRegister select").after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");
//    $("#frmRegister input").not('[disabled]').after("<span style=color:red>&nbsp;&nbsp;&nbsp;*</span>");

//    // Immediately hide the red * for valid input and select fields
//    $("#frmRegister input:valid").next("span").hide();
//    $("#frmRegister select").trigger("change");   // more complicated for select option group
//    //#endregion

//    $('#modalRegister').modal({ backdrop: 'static', keyboard: false });

//});

/* Code for displaying Viewport and window size */
//window.addEventListener("resize", displayViewportSize, false);
//function displayViewportSize(e) {
//    var viewportWidth = document.documentElement.clientWidth;
//    var viewportHeight = document.documentElement.clientHeight;
//    var obj = $('#scrResolutionLabel').text("Viewport Width: " + viewportWidth + " Viewport height: " + viewportHeight  + "\nResolution W: " + window.screen.availWidth + " Resolution H: " + window.screen.availHeight);    
//    obj.html(obj.html().replace(/\n/g, '<br/>'));   
//}


/* Testing stuff */
//$.ajax('https://epic.gsfc.nasa.gov/api/natural', {
//    success: function (iDataArr, stat, xhr) {
//        var stop = 'now;'
//    }
//});

//function makeMultiplier(multiplier) {
//    var myFunc = function(x) {
//        return multiplier * x;
//    }
//    return myFunc;
//}
//var multipleBy3 = makeMultiplier(3);  
//var result = multipleBy3(10);
//console.log(result);

//var multiplyBy10 = makeMultiplier(10);    
//result = multiplyBy10(10);
//console.log(result);

//function performOperationOn(x, operation) {
//    return operation(x);
//}

//var result = performOperationOn(5, multipleBy3);    
//console.log(result);
//result = performOperationOn(20, multiplyBy10);    
//console.log(result);

// 07/05/2018   -   
//if (typeof (jqXHR.responseJSON) === "object") {
//    if (jqXHR.responseJSON.hasOwnProperty("CustomErrorMessage")) {
//        var custMsg = jqXHR.responseJSON.CustomErrorMessage;
//        custMsg.search(/finalised/i) >= 0 ? alert(custMsg) : alert("There has been a system error while removing the file.");
//    }
//}
// 07/05/2018   -   Distinguish between the webserver directory missing and the TRACS target directory missing
//if (typeof (jqXHR.responseJSON) === "object") {     
//    if (jqXHR.responseJSON.hasOwnProperty("CustomErrorMessage")) {
//        var custMsg = jqXHR.responseJSON.CustomErrorMessage;              
//        custMsg.search(/WEBSERVER/i) >= 0 ? alert("A system error occurred on the Webserver\nA Webserver directory is missing.\nRefer this error to the systems programmer.")
//                                                 : alert("The TRACS target directory is missing\nMake sure the Directory exists under the TRACS folder.");
//    }          
//}
// attempt atfunctional programming
//var outArray = []
//var numbers = [4, 9, 16, 25];
//var addFormData = function (number) {
//    number = number + 3;
//};
//var processFiles = function (fn, numbers) {
//    return numbers.map(fn);
//};    
//outArray = processFiles(addFormData, numbers);

//console.log("name : " + file.name);   
//console.log("size : " + file.size);   
//console.log("type : " + file.type);   
//console.log("date : " + file.lastModified );       

//for (var i = 0; i < $files.length; i++) {
//    //formData.append($files[i].name, $files[i])
//    formData.append(i, $files[i])
//}

//var $files = [];
//$files = this.files;
//$.each(this.files, function (obj, v) {
//    var file = v;
//    var filename = v.name;
//    var id = $id;
//    //formData.append(id, file, filename)
//    formData.append($auditId, file);
//});
//var $btnInactivate = $('<input>', {
//    class: "delete btn btn-default btn-xs btn-block",
//    role: "button",
//    type: "button",
//    value: "InActivate"
//});
//$btnInactivate.attr('disabled', 'disabled');  // 5/12/2017 - removed Inactivate Button

//$tr.append($('<td/>', {                      
//    html: $btnInactivate,
//    'style': 'width:5%;text-align:center;'
//})).append($('<td/>', {
//    html: $btnUpdate,
//    'style': 'width:5%;text-align:center;'
//}));
//colCounter += 2;

//function ValidationGetResponseObject(response) {
//    var resp = JSON.parse(response);

//    if (resp && resp.Data && resp.Data.Tag && resp.Data.Tag === "ValidationError") {
//        return resp;
//    }
//    else if (resp && resp.CustomErrorMessage) {
//        return resp;
//    }
//    else if (resp && resp.Message) {
//        return resp;
//    }
//    else
//        return null;
//}

//function callASynchronousAjax(Url) {
//    // Note - Had to use an Ajax call here and set it to async, otherwise processing was getting out of order.
//    return $.ajax({
//        url: Url,
//        type: 'GET',
//        async: true,
//        success: function (data, status, jqXHR) {
//            if (data.CustomErrorMessage) {
//                var $messages = $('#messages');
//                $messages.css('display', 'block').attr('class', 'message');                
//                var userMsg = "Completed successfully with a message.";
//                userMsg = userMsg + "\n" + data.CustomErrorMessage;
//                $messages.html(userMsg.replace(new RegExp('\\n', "g"), '</br>'));
//                return data;
//            }
//            return data;
//        }
//    }).fail(function (jqXHR, textStatus, err) {
//        errorCallback(jqXHR, textStatus, err);
//        return false; // exit the routine if a problems occurs.
//    });
//}

//$(document.body).on("click", "#table_data_mm tbody .add-to-parent", function () {

//    var $tr = $(this).closest('tr');    //  Currently selected row
//    var $child_id = $($tr).attr('id');
//    var $parent_id = $($tr).data('parent_id');     // passed as data attribute setup in BuildDataRow

//    var uriFinal = uriBaseConst + '/' + "details" + '/' + "audit_measures" + '/' + $parent_id + '/' + $child_id;

//    $.ajax({
//        //url: uriFinal + "?key=1&key2=walloping&key3=bushwacker",
//        url: uriFinal + "?key=" + metaKey2,
//        type: 'POST',
//        contentType: 'application/json;charset=utf-8',
//        dataType: "json",
//        beforeSend: setHeader,
//        success: function (data, jqXHR) {

//            $("[id^='modalDismiss']").click();
//            // After the modal is dismissed, the parent table is available - simulate click event on the row with the id of parent id to rebuild the mtm modal
//            $('#' + $parent_id + ' .manage_mtm').click();
//            if (data.CustomErrorMessage) {
//                var $messages = $('#messages_mm');
//                $messages.css('display', 'block').attr('class', 'message goodmessage');                
//                $messages.html(data.CustomErrorMessage);
//            }
//        }
//    }).fail(function (jqXHR, textStatus, err) {
//        errorCallback(jqXHR, textStatus, err, true);
//    });

//});
