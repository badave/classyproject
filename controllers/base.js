module.exports = Bootie.CrudController.extend({

  ////////////////
  // Middleware //
  ////////////////

  // Refer to BaseController for middlewares for missingParams and strip params

  /////////////
  // Helpers //
  /////////////
  //
  //
  // Pass in a query_builder for the second param.  collections have query builders (collection.query());
  prepareQuery: function(req, query) {
    var qs = req.query;

    if (req.user) {
      query.where({
        user_id: req.user.id
      });
    }

    // Since/Until or From/To based on updated timestamp in ms
    var since = qs.since || qs.from;
    var until = qs.until || qs.to;

    if (since) {
      query.andWhere('updated_at', '>=', new Date(since));
    }

    if (until) {
      query.andWhere('updated_at', '<=', new Date(until));
    }

    // turns req.params.ids into query string params
    if (req.params) {
      for (var key in req.params) {
        if (/id/.test(key)) {
          query.andWhere(key, req.params[key]);
        }
      }
    }

    return query;
  },

  prepareQueryOptions: function(req, query) {
    var qs = req.query;

    var offset = qs.skip || qs.offset || 0;
    var limit = qs.limit || qs.count || 100;
    var sort = qs.sort || "updated_at";

    var order = qs.order || "DESC";

    query.orderBy(sort, order.toUpperCase() || "DESC");
    query.offset(offset);
    query.limit(limit);

    req.offset = offset;
    req.limit = limit;

    return query;
  },

  extractId: function(req) {
    var id = null;

    if (req.params.id) {
      id = req.params.id;
    } else if (req.body.id) {
      id = req.body.id;
    } else if (req.query.id) {
      id = req.query.id;
    }

    if (id) {
      return id;
    }
  },

  // readies the model for sexytime
  setupModel: function(req) {
    var model = new this.model();

    // moves flags to the model
    model.flags = req.flags;

    // decodes from base62
    var ids = this.decodeIds(req);
    // transformParentParams moves ids from the params to the req.body
    model.set(ids);

    var id = this.extractId(req);
    if (id) {
      model.setId(id);
    }

    if (req.user) {
      model.user = req.user;
      model.setUserId(req.user.id);
    }

    model.req = req;

    return model;
  },

  // CRUD functions
  find: function(req, res, next) {
    var err;
    var that = this;
    var collection = new this.collection();

    var query = collection.query();

    this.prepareQuery(req, query);
    this.prepareQueryOptions(req, query);

    collection.fetch()
      .tap(function() {
        collection.resetQuery();

        var query = collection.query();

        query.count("id");

        that.prepareQuery(req, query);

        return query.then(function(c) {
          var count = collection.length;
          var total = c[0].count;

          res.paging = {
            total: parseInt(total),
            count: parseInt(count),
            limit: parseInt(req.limit),
            offset: parseInt(req.offset),
            has_more: parseInt(count) < parseInt(total)
          };
        });

      }).then(this.nextThen(req, res, next)).
    catch (this.nextCatch(req, res, next));
  },

  findOne: function(req, res, next) {
    var err;
    var that = this;
    var model = this.setupModel(req);

    model.fetch({
      require: true
    })
      .then(that.successHandler(req, res, next))
      .otherwise(that.errorHandler(req, res, next));
  },

  create: function(req, res, next) {
    var that = this;

    var model = this.setupModel(req);

    model.setFromRequest(req.body);

    this.saveModel(model, req, res, next);
  },

  // Save model
  saveModel: function(model, req, res, next) {
    var that = this;

    model.save()
      .then(that.successHandler(req, res, next))
      .otherwise(that.errorHandler(req, res, next));
  },

  update: function(req, res, next) {
    var that = this;
    var model = this.setupModel(req);

    model.fetch({
      require: true
    })
      .then(function() {

        var attributes = model.setFromRequest(req.body);

        // Save BaseModel
        return model.save(attributes, {
          patch: true
        })
          .then(that.successHandler(req, res, next))
          .otherwise(that.errorHandler(req, res, next));

      })
      .otherwise(that.errorHandler(req, res, next));
  },

  destroy: function(req, res, next) {
    var that = this;
    var model = this.setupModel(req);

    model.fetch({
      require: true
    })
      .then(function() {

        // Create model instance
        model.destroy({
          require: true
        })
          .then(that.successHandler(req, res, next))
          .otherwise(that.errorHandler(req, res, next));

      })
      .otherwise(that.errorHandler(req, res, next));
  },



  // findOne: function(req, res, next, options) {
  //   var model = this.setupModel(req);
  //   options = options || {};
  //   _.merge(options, {
  //     require: true
  //   });

  //   if (this.debug) {
  //     if (options.query) {
  //       console.log("Find with Query: %s and UserID: %s".verbose, JSON.stringify(options.query), model.get('user_id'));
  //     } else {
  //       console.log("Find with ID: %s and UserID: %s".verbose, model.id, model.get('user_id'));
  //     }
  //   }

  //   return model.fetch(options).then(this.nextThen(req, res, next)).
  //   catch (this.nextCatch(req, res, next));
  // },

  // create: function(req, res, next) {
  //   var model = this.setupModel(req);
  //   model.setFromRequest(req.body);
  //   return model.save().bind(this).then(this.nextThen(req, res, next)).
  //   catch (this.nextCatch(req, res, next));
  // },

  // update: function(req, res, next) {
  //   var model = this.setupModel(req);
  //   model.setFromRequest(req.body);
  //   return model.save().bind(this).then(this.nextThen(req, res, next)).
  //   catch (this.nextCatch(req, res, next));
  // },

  // destroy: function(req, res, next) {
  //   var model = this.setupModel(req);
  //   return model.destroy().then(function(resp) {
  //     if (resp === 0) {
  //       var err = new Error("Document not found.");
  //       err.code = 404;
  //       return next(err);
  //     }

  //     res.code = 204;
  //     return next();
  //   }).
  //   catch (this.nextCatch(req, res, next));
  // }
});
