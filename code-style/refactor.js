var someService = {
  deleteComponent : function(componentId, notify, options, module){

    options = options || {};

    // Check the load state
    if(!Yola.designView.loading.isReady()){
      Yola.logger.warn("ComponentController.deleteComponent(): Waiting for server. Unable to continue.");
      return false;
    }

    // Find the component
    var component = page.pageMapController.getNodeById(componentId);
    if(component == null){
      alert( sprintf(_("Error: Invalid component id '%s' specified."), componentId));
      return false;
    }
    var componentElement = component._getEl();
    if(!componentElement){
      alert(_("Error: Component is null or not an object."));
      return false;
    }

    if(notify && !confirm(_("Are you sure you want to delete this widget?"))){
      return false;
    }

    this.releaseComponent(component);

    // Remove Dynamic CSS
    $(componentId + "_CSS").remove();

    // Find the parent
    var parent = component._parent;
    var parentElement = parent._getEl();

    // Release the component
    var boundComponentCount = page.componentController.selectedComponents.length;

    if(component._parent.components.length > 1 && boundComponentCount == 1){
      for(var i = 0; i < component._parent.components.length; i++){
        if(component._parent.components[i] == component){
          page.componentController.selectComponent(component._parent.components[((i==0)?(i+1):(i-1))].id);
        }
      }
    }else{
      page.componentController.releaseComponent(component);
    }

    // Delete the component HTML
    parentElement.removeChild(componentElement);

    // Delete the component definition
    var compIndex = page.pageMapController.getNodeIndex(component);
    parent.components.splice(compIndex, 1);
    page.pageMapController.build();

    if(notify != false){
      page.componentController.onWidgetSelectionChange();
      page.componentController.alignLayouts();
    }

    // Update parent region
    re = /layout/;

    // only resize if we're not a top-level layout region
    if(! parentElement.parentNode.id.match(re)){
      if(parent.components.length == 0 && parentElement.tagName != "BODY"){
        parentElement.innerHTML = "&nbsp;";
      }
    }

    YAHOO.util.DragDropMgr.refreshCache();

    // Update saved status
    page.pageMapController.trackChanges(component, "delete");
    page.pageMapController.trackChanges(component, "seq");
    page.pageMapController.initRegionCTA();
    page.componentController.selectPage();

  }
};