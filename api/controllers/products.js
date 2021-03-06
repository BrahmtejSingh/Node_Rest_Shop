const mongoose=require('mongoose');

const Product=require('../models/product');

exports.products_get_all=(req,res,next)=>{
    Product.find().select('name price _id productImage').exec().then(docs=>{
        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        if(docs.length >= 0){
            res.status(200).json(response);
        } else{
            res.status(404).json({messege:"No entries found"})
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_create_product=(req,res,next)=>{
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            messege: 'Product Created',
            createdProduct:{
                name:result.name,
                pice:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_get_product=(req,res,next)=>{
    const id=req.params.productId; 
    Product.findById(id).select('name price _id productImage').exec().then(doc => {
        console.log("From Database",doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({messege :"No valid ID found"});
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_update_product=(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps}).exec().then(result=>{
        res.status(200).json({

            messege:'Product Updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/' + id
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_delete_product=(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id:id}).exec().then(result=>{
        res.status(200).json({
            messege:'Product Deleted',
            url:'http://localhost:3000/products',
            body:{name:'String',price:'Number'}
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}