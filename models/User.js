const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true,
        match: /[0-9]{5}/
    },
    firstName: String,
    lastName: String,
    bio: String,
    portraitUrl: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    savedPosts: [Schema.Types.ObjectId]
});

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

userSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', userSchema);
