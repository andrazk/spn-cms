var Post = Spine.Model.sub({
	name: 'Enter post name',
	content: 'Enter pos content',
	published: false
});
Post.configure('Post', 'name', 'content', 'published');
Post.extend(Spine.Model.Local);

var PostList = Spine.Controller.sub({
	events: {

	},

	elements: {

	},

	init: function(){		
		Post.bind("create",  this.proxy(this.addOne));
    Post.bind('refresh', this.proxy(this.addAll));
    this.proxy(this.addAll());
	},

  addOne: function(post){
  	//console.log(post.name, this.el);
  	var tpl = $(this.el).data('spn-tpl');
  	var item = new PostItem({item: post, tpl: tpl});
    this.el.append(item.render().el);
  },

  addAll: function(){
  	Post.each(this.proxy(this.addOne));
  },

  createPost: function(){
  	Post.create({name: 'Enter post name', content: 'Enter post content'});
  }
});


var PostItem = Spine.Controller.sub({   
	events: {
		'click [data-spn-ctrl="delete"]': 'deletePost',
		'click [data-spn-ctrl="edit"]': 'editPost',
		'click [data-spn-ctrl="update"]': 'updatePost'
	},

	elements: {
		'[data-spn-edit]': 'contentediteble',
		'[data-spn-ctrl="delete"]': 'deleteBtn',
		'[data-spn-ctrl="edit"]': 'editBtn',
		'[data-spn-ctrl="update"]': 'updateBtn'
	},

  init: function(){
  	Spine.bind('editable', this.proxy(this.editable));
    this.item.bind("update", this.proxy(this.render));
    this.item.bind("destroy", this.proxy(this.remove));
  },

  render: function(){
  	var self = this;
    spn.render(this.tpl, this.item, function(err, out){
    	if(err){
    		console.log(err);
    		return this;
    	}
    	self.replace(out);
    });

    this.proxy(this.editable(this.editable));
    
    return this;
  },

	editable: function(e){
		this.editable = e;
		this.editable ? this.proxy(this.showCP()) : this.proxy(this.hideCP());
	},

	showCP: function(){
		var self = this;

		spn.render('postControlPanel', {}, function(err, out){
    	if(err){
    		console.log(err);
    		return this;
    	}

    	if(!spn.checkPosition(self.el)){
    		$(self.el).css('position', 'relative');
    	}

    	self.el.append(out);
    	self.refreshElements();
    });
    return this;
	},

	hideCP: function(){
		console.log(this);
	},

  remove: function(){
    this.el.remove();
    this.release();
  },

  deletePost: function(){
  	this.item.destroy();
  },

  editPost: function(){
  	this.editBtn.hide();
  	this.updateBtn.show();

  	this.contentediteble.each(function(i, el){
  		$(el).attr('contenteditable', '');
  	});
  },

  updatePost: function(){
  	var self = this;
  	this.editBtn.show();
  	this.updateBtn.hide();

  	this.contentediteble.each(function(i, el){
  		$(el).attr('contenteditable', null);

  		var key = $(el).data('spn-edit');
  		self.item[key] = $(el).html();
  	});

  	self.item.save();
  }
});

var SpnCms = Spine.Controller.sub({
	events: {
		'click [data-spn-type="editable"]': 'editable'
	},

	elements: {
		'[data-spn-type="postList"]': 'postList'
	},

  init: function(){
  	Post.fetch();
    this.proxy(this.addAll());
  },

  addOne: function(i, el){
  	var item = new PostList({el: el}); 
  },

  addAll: function(){
  	this.postList.each(this.proxy(this.addOne));
  },

  editable: function(){
  	spn.editable = !spn.editable;
		Spine.trigger('editable', spn.editable);
  },


});





Zepto(function($) {
	

  return new SpnCms({
    el: $('[data-spn-type="cms"]')
  });


});



