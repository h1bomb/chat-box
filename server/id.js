var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect(process.DB_URL);

var id = exports;
var genID = new Schema(
{
   id         : {type : Number, default: 1 },
   modelname  : { type: String }
});


mongoose.model('genID', genID);
var idg = mongoose.model('genID');

id.get= function(modelName, callback)
{
    idg.findOne({modelname : modelName},function(err,doc)
	{
   		if(doc)
		{
			idg.update({modelname : modelName},{id:parseInt(doc.id+1)},function(err)
			{
	            if(err) throw err('IdGenerator.getNewID.update() error');
	            else callback(parseInt(doc.id.toString())+1);
			});
        }
        else
		{
            doc = new idg();
            doc.modelname = modelName;
	        doc.save(function(err)
	        {
	            if(err) throw err('IdGenerator.getNewID.save() error');
	            else callback(parseInt(doc.id.toString()));
	        });
        }

    });
}
