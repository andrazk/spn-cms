var spn = spn || {};

(function(spn){

spn.editable = false;

// Check if parent position is fixed, relative or absolute
spn.checkPosition = function(el){
	var pos = $(el).css('position');
	if(pos == 'fixed' || pos == 'relative' || pos == 'absolute'){
		return true;
	}
	return false;
};

spn.render = function(id, ctx, callback){
	dust.render(id, ctx, function(err, out) {
	  if(err){
	  	var compiled = dust.compile($('#'+id).html(), id);
			dust.loadSource(compiled);
			dust.render(id, ctx, callback);
	  }else{
	 		callback(err, out);
		}
	});
};

})(spn);