import mongoose,{Schema}from "mongoose"

const userSchema = new  Schema({

    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:[true,'email is reequird'],
        lowercase:true,
         match: [/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/, 'Please enter a valid email']
    },
  
    password:{
    type:Number,
    requird:[true,'password id required'],
    maxlength:[6,"password must be 6 number"]
    },
   phone: { type :String,
            trim:value
        },

        role:{
            type:String,
            enum:['admin','owner','staff','customer'],
            default:customer
        },

        isActive:{
            type:Boolean,
            default:true
        }
    
},
    {timestamps:true})

 export const User= mongoose.model("User",userSchema)