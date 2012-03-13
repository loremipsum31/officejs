var TabbularGadget = {

  addNewTabGadget: function(form_id){
            
    // add new gadget and render it
    form_gadget = $("#form_gadget");
    tab_container = form_gadget.parent();
    form_gadget.remove();
    // XXX: 
    html_string =['<div id="form_gadget" ',
                  'gadget="' + form_id + '/Form_asRenderJSGadget" ',
                  'gadget:data-source="Form_asJSON?form_id=' + form_id + '"',
                  'gadget:property="{&quot;cacheable&quot;: &quot;1&quot;, &quot;cache_id&quot;: &quot;' + form_id + '&quot;}"></div>'].join('\n');
    tab_container.append(html_string);

    form_gadget = $("#form_gadget");
    Form.setCurrentFormId(form_id);
    
    // render new gadget
    RenderJs.loadGadgetFromUrl(form_gadget);

    // Update it (XXX: how to know gadget loaded the DOM?)
    window.setTimeout("RenderJs.updateGadgetData(form_gadget)", 500);

    // mark tab as active visually
    $("li.selected").addClass("not_selected"); $("li.selected").removeClass("selected");
    $("#"+form_id).addClass("selected"); $("#"+form_id).removeClass("not_selected")
    
  }
  
}

/*
  Form field renderer
*/
var Form = {

  // elements marked with this class can be serizlized to server
  SERIALIZE_ABLE_CLASS_NAME: "serialize-able",

  CURRENT_FORM_ID: "",

  getCurrentFormId: function (){
                    /* Get current form ID (return hard coded one for now) */
                    return Form.CURRENT_FORM_ID;
  },

  setCurrentFormId: function (form_id){
                    /* Set current form ID (return hard coded one for now) */
                    Form.CURRENT_FORM_ID = form_id;
  },
  
  
  getFieldId: function(field_id){
              /* Generate local form field id */
              return "field_" + field_id;
  },

  updateField: function (dom, field_dict){
              /* General purpose field updater */
              editable = Boolean(field_dict['editable']);
              if (editable){
                dom.val(field_dict["value"]);}
              else{
                // if field is not editable just show its value
                dom.replaceWith(field_dict["value"]);}
  },

  addOptionTagList: function (index, value){
              if(value[1]==field_value){
                select_dom.append('<option selected value="' + value[1] + '">'  + value[0] + '</option>');}
              else{
                select_dom.append('<option value="' + value[1] + '">'  + value[0] + '</option>'); }
              },
  
  BaseInputField: function (field_id, field_dict){
              /* HTML based input field */
              dom = $("[name=" + Form.getFieldId(field_id) + "]");
              Form.updateField(dom, field_dict);
              dom.attr("size", field_dict["display_width"]);
              return dom;
  },
  
  ListField: function (field_id, field_dict){
              /* Select field */
              field_value = field_dict["value"]
              select_dom = $("select[name=" + Form.getFieldId(field_id) + "]");
              $.each(field_dict["items"], Form.addOptionTagList);
              return select_dom;              
  },
  
  ParallelListField: function (field_id, field_dict){
              /* mutiple select fields */
              // XXX: we render only first value but it can be many how to get them ?
              field_value = field_dict["value"][0]
              select_dom = $("select[name=subfield_field_" + field_id + "]");
              $.each(field_dict["items"], Form.addOptionTagList);
              return select_dom;
  },
  
  CheckBoxField: function (field_id, field_dict){
              /* CheckBoxField field */
              checked = Boolean(field_dict["value"])
              checkbox_dom = $("input[name=" + Form.getFieldId(field_id) + "]");
              if (checked){
                  checkbox_dom.attr('checked', true)}
              return checkbox_dom;
  },

  TextAreaField: function (field_id, field_dict){
              /* TextArea field */
              return Form.BaseInputField(field_id, field_dict);
  },
  
  StringField: function (field_id, field_dict){
              /* String field */
              return Form.BaseInputField(field_id, field_dict);
  },
  
  IntegerField: function (field_id, field_dict){
              /* Int field */
              return Form.BaseInputField(field_id, field_dict);
  },
  
  PasswordField: function (field_id, field_dict){
              /* PasswordField field */
              return Form.BaseInputField(field_id, field_dict);
  },

  DateTimeField: function (field_id, field_dict){
              /* DateTimeField field */
              //alert(field_id);
              return Form.BaseInputField(field_id, field_dict);
  },
  
  EmailField: function (field_id, field_dict){
              /* Email field */
              return Form.BaseInputField(field_id, field_dict);
  },
  
  FormBox: function (field_id, field_dict){
              /* Email field */
              return Form.BaseInputField(field_id, field_dict);
  },

  RelationStringField: function (field_id, field_dict){
              /* Relation field */
              return Form.BaseInputField(field_id, field_dict);
  },

  ImageField:  function (field_id, field_dict){
              /* Image field */
              dom = $("img[name=" + Form.getFieldId(field_id) + "]");
              // XXX: image field should return details like quality, etc ...
              dom.attr("src", field_dict["value"]+ "?quality=75.0&display=thumbnail&format=png");
  },
  
  ListBox:  function (field_id, field_dict){
              /* Listbox field */
              listbox_id = "field_" + field_id;
              navigation_id = listbox_id + "_pager";              
              listbox_table = jQuery("#"+listbox_id);
              current_form_id = Form.getCurrentFormId();
              
              listbox_dict = field_dict['listbox']
              listbox_data_url = listbox_dict["listbox_data_url"]
              colModel = []
              column_title_list = [];
              $.each(listbox_dict['columns'],
                       function(i, value){
                         index = value[0];
                         title = value[1];
                         column_title_list.push(title);
                         column = {'name': index,
                                   'index': index,
                                   'width': 100,
                                   'align': 'left'}
                         colModel.push(column);
              });
             
              listbox_table.jqGrid( {url:listbox_data_url + '?form_id=' + current_form_id + '&amps;listbox_id=' + field_id,
                            datatype: "json",
                            colNames:  column_title_list,
                            colModel: colModel,
                            rowNum:listbox_dict['lines'],
                            pager: '#'+navigation_id,
                            sortname: 'id',
                            viewrecords: true,
                            sortorder: "desc",
                            caption: field_dict["title"] });
              listbox_table.jqGrid('navGrid', '#'+navigation_id, {edit:false,add:false,del:false});
              return listbox_table;
  },

}

/* Generic form updater */
var FormUpdater = {
                   

  update: function(data){
              /* Update form values */
              $.each(data['form_data'],
                     function(field_id, field_dict){
                        type = field_dict["type"];
                        dom = undefined;
                        if (type=="ListField"){
                          dom = Form.ListField(field_id, field_dict);}
                        if (type=="ParallelListField"){
                          dom = Form.ParallelListField(field_id, field_dict);}
                        if (type=="TextAreaField"){
                          dom = Form.TextAreaField(field_id, field_dict);}
                        if (type=="StringField"){
                          dom = Form.StringField(field_id, field_dict);}
                        if (type=="IntegerField"){
                          dom = Form.IntegerField(field_id, field_dict);}
                        if (type=="EmailField"){
                          dom = Form.EmailField(field_id, field_dict);}
                        if (type=="FormBox"){
                          dom = Form.FormBox(field_id, field_dict);}
                        if (type=="RelationStringField"){
                          dom = Form.RelationStringField(field_id, field_dict);}
                        if (type=="CheckBoxField"){
                          dom = Form.CheckBoxField(field_id, field_dict);}
                        if (type=="ListBox"){
                          dom = Form.ListBox(field_id, field_dict);}
                        if (type=="ImageField"){
                          dom = Form.ImageField(field_id, field_dict);}
                        if (type=="PasswordField"){
                          dom = Form.PasswordField(field_id, field_dict);}
                        if (type=="DateTimeField"){
                          dom = Form.DateTimeField(field_id, field_dict);}
                          
                        // add a class that these fields are editable so asJSON
                        // can serialize for for sending to server
                        if (dom!=undefined||field_dict["editable"]){
                          dom.addClass(Form.SERIALIZE_ABLE_CLASS_NAME);}                        

                        // mark required fields visually
                        if (field_dict["required"]){
                          dom.parent().parent().children("label").css("font-weight", "bold");}
                         
                      });
  },

  save: function(){
              /* save form to server*/
              form_value_dict = {}
              $("." + Form.SERIALIZE_ABLE_CLASS_NAME).each(function(index) {
                // DOM can change values, i.e. alter checkbox (on / off)
                element = $(this); 
                name = element.attr("name");
                value = element.val();
                type = element.attr("type");
                if (type=="checkbox"){
                  value = element.is(":checked");
                  value = {true:1, false:0}[value];}
                // XXX: how to handle file uploads ?
                form_value_dict[name] = value;
              });
              console.log(form_value_dict);
              
              // add form_id as we need to know structure we're saving at server side
              form_value_dict["form_id"] = Form.getCurrentFormId();
                
              // validation happens at server side
              $.ajax({url:'Form_save',
                      data: form_value_dict,
                      dataType: "json",
                      success: function (data) {
                        field_errors = data.field_errors;
                        if (field_errors!=undefined){
                          console.log(field_errors);
                          $.each(field_errors, function(index, value){
                              dom = $("[name=" + Form.getFieldId(index) + "]");
                              dom.css("border", "1px solid red"); // XXX: use class / css
                              field = dom.parent().parent();
                              if (field.children("span.error").length > 0){
                                // just update message
                                field.children("span.error").html(value);}
                              else{
                                // no validation error message exists
                                field.append('<span class="error">' + value + '</span>');}
                            }
                          );}
                        else{
                          // validation OK at server side
                          $("span.error").each(function(index) {
                            // delete validation messages
                            element = $(this);
                            element.parent().children("div.input").children("." +Form.SERIALIZE_ABLE_CLASS_NAME).css("border", "none");
                            element.remove();
                          });
                          // show a fading portal_status_message
                          $("#portal_status_message").toggle();
                          $("#portal_status_message p").html("Saved");
                          window.setTimeout( '$("#portal_status_message").toggle()', 4000);
                        }
                      }});
  },
}

/*
 * Generic Gadget library renderer
 */

var RenderJs = {

    // Local cache ID
    APP_CACHE_ID : "app_cache10",
    
    bootstrap: function (root){
              /* initial load application gadget */
              RenderJs.loadGadgetFromUrl(root);
              RenderJs.load(root);
    },
    
    load: function (root) {
              /* Load gadget layout by traversing DOM */
              gadget_list = root.find("[gadget]");
              // Load chilren
              gadget_list.each(function(i,v){RenderJs.loadGadgetFromUrl($(this));});
    },

    updateAndRecurse: function(gadget, data){
              /* Update current gadget and recurse down */
              gadget.append(data);
              // a gadget may contain sub gadgets
              RenderJs.load(gadget);
    },
    
    loadGadgetFromUrl: function(gadget) {
              /* Load gadget's SPECs from URL */
              url = gadget.attr("gadget");

              // XXX: based on URL and more ? generate gadget uid?

              // XXX: How to know how long a form should be cached locally
              // i.e. what happens if it changes at server side ?
              
              // handle caching
              gadget_property = gadget.attr("gadget:property");

              cacheable = false;
              if (gadget_property!=undefined){
                gadget_property = $.parseJSON(gadget_property)
                cacheable = Boolean(gadget_property.cacheable);}
              //cacheable = false ; // to develop faster
              if (cacheable){
                  // get from cache if possible, use last part from URL as cache_key
                  cache_id = gadget_property.cache_id
                  cache_id = RenderJs.APP_CACHE_ID + "_" + cache_id
                  app_cache = $.jStorage.get(cache_id, undefined);
                                      
                  if(app_cache==undefined){
                    // not in cache so we pull from network and cache
                    //console.log("not in cache: " + cache_id + "  " + url);
                    $.ajax({url:url,
                            yourCustomData: {"cache_id": cache_id},
                            success: function (data) {
                                        cache_id = this.yourCustomData.cache_id;
                                        console.log("set in cache: " + cache_id);
                                        $.jStorage.set(cache_id, data)
                                        RenderJs.updateAndRecurse(gadget, data);
                              }});
                    }
                  else{
                    // get from cache
                    //console.log("get from cache " +cache_id);
                    data = app_cache; //app_cache[cache_id];
                    RenderJs.updateAndRecurse(gadget, data);}
                }
              else{
                // not to be cached
                //console.log("Not to be cached " + url);
                $.ajax({url:url,
                        success: function (data) {
                          RenderJs.updateAndRecurse(gadget, data);},});
                }
              
    },

    update: function (root) {
              /* update gadget with data from remote source */
              root.find("[gadget]").each(function(i,v){RenderJs.updateGadgetData($(this));});
    },
    
    updateGadgetData: function(gadget) {
              /* Do real gagdet update here */
              data_source = gadget.attr("gadget:data-source");
              data_handler = gadget.attr("gadget:data-handler");
              // acquire data and pass it to method handler
              if (data_source!=undefined){
                // XXX: what if we don't have a data-handler and all is in data-source?
                $.getJSON(data_source,
                          function (result) {FormUpdater.update(result);});
              }
    },   
}


function test(){
  RenderJs.update($("#content"));
}

// init all when DOM is ready
$(document).ready(function() {
   RenderJs.bootstrap($("#content"));
   // XXX: we use timeouts as we do not know if gadget structure is yet ready, how to do that in a generic way?
   window.setTimeout("test()", 500);
 });  
