import React, {Component} from 'react';
import {Text, View,Alert,ActivityIndicator,ScrollView,AsyncStorage,Linking} from 'react-native';
import {Button} from 'react-native-elements';
import firebase from 'react-native-firebase'
import {TextField} from 'react-native-material-textfield'
import { connect } from "react-redux";
import { url } from "./Proxy";
import { Dropdown } from 'react-native-material-dropdown'
import { countries } from "./countries";
import { setUIDAction } from "../store/actions/actions";
class Signup extends Component{
    constructor(props){
      super(props)
      this.state={
        name:"",
        pass:"",
        email:'',
        loading:false,
        confirm:'',
        countryData :[],
        country:'United States'
      }
      this.handleSubmit=this.handleSubmit.bind(this)
      this._goToURL=this._goToURL.bind(this)
    }
    _goToURL() {
      const url = 'https://firebasestorage.googleapis.com/v0/b/pureartisanapp.appspot.com/o/Privacy%20Policy-14-05-2019%20v2.docx?alt=media&token=926bb799-5d7b-4c0f-93e5-a34278fb2575'
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Don\'t know how to open URI: ' + this.props.url);
        }
      });
    }
    async handleSubmit(){
      this.setState({loading:true})
      if(this.state.email===''){
        Alert.alert('Failed','Email is required')
      }
      else if(this.state.pass===''||this.state.confirm==''){
        Alert.alert('Failed','Password is required')

      }
      else if(this.state.name===''){
        Alert.alert('Failed','Name is required')

      }
      else if(this.state.pass!==''&&this.state.confirm!==''&&(this.state.pass!==this.state.confirm)){
        Alert.alert('Failed','Passwords do not match')

      }
      else{
        await firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.pass).then((user)=>{
          let userData = {
            fName:this.state.name,
            email:this.state.email,
            firebaseUID:user.user.uid,
            country:this.state.country
          }
          console.log(userData)
          fetch(url+'/api/addUser',{method:"POST",body:JSON.stringify(userData),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(data=>{
            this.setState({loading:false})
            if(data.error)
            Alert.alert("Failed",data.message)
            else
            {
              this.setState({loading:false})
              AsyncStorage.setItem('userData',JSON.stringify(data.user))
              this.props.setUID(data.user.firebaseUID)
              this.props.navigation.navigate('HomeScreen')
            }
          }).catch(err=>console.log(err))
        }).catch(err=>{ 
         this.setState({loading:false});
         Alert.alert('Failed',err.message)})
      }
     }
     componentDidMount(){
      let countryData = countries.map(country=>{
        return{
            value:country.name
        }
    })
    this.setState({countryData})
     }
      render(){
        if(this.state.loading===false){
          return(
            <ScrollView style={{flex:1,backgroundColor:'white'}}>


            <View style={{marginTop:35,marginLeft:20}}>
            <Text style={{color:'brown',fontSize:40}}>Join Pure Artisan</Text>
            </View>
            <TextField style={{alignSelf:'center'}}
            label='Full Name'
            value={this.state.name}
            onChangeText={ (name) => this.setState({ name }) }
            tintColor="darkred"
            containerStyle={{marginLeft:15,marginRight:15,marginTop:20}}
            
            />
          
            <TextField style={{alignSelf:'center'}}
            label='Email'
            value={this.state.email}
            onChangeText={ (email) => this.setState({ email }) }
            tintColor="darkred"
            containerStyle={{marginLeft:15,marginRight:15}}
            keyboardType='email-address'
            autoCapitalize='none'
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            />
          
            <TextField style={{alignSelf:'center'}}
            label='Password'
            value={this.state.pass}
            onChangeText={ (pass) => this.setState({ pass }) }
            tintColor="darkred"
            autoCapitalize='none'
            secureTextEntry={true}
            containerStyle={{marginLeft:15,marginRight:15}}
            
            />
                        <TextField style={{alignSelf:'center'}}
            label='Confirm Password'
            value={this.state.confirm}
            onChangeText={ (confirm) => this.setState({ confirm }) }
            tintColor="darkred"
            autoCapitalize='none'
            secureTextEntry={true}
            containerStyle={{marginLeft:15,marginRight:15}}
            
            />
            <View style={{ marginLeft: 7, marginTop: 7, flexDirection: 'row',justifyContent:'center' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%',alignSelf:'center' }}
                                    label='Country'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.country}
                                    data={this.state.countryData}
                                    onChangeText={text => this.setState({ country: text })}
                                />
                            </View>
                        </View>
          <View style={{marginLeft:20,marginTop:40,width:'70%'}}>
            <Text>
            <Text>By registering or logging in, you accept our</Text>
            <Text onPress={this._goToURL} style={{color:'blue', marginLeft:3}}>Terms & Privacy Policy.</Text>
            </Text>
          </View>
          
          
          <View style={{alignItems:'center',justifyContenty:'center',marginTop:65}}>
            <Button title="Register"  onPress={this.handleSubmit} containerStyle={{borderRadius:20,width:'80%'}}  buttonStyle={{backgroundColor:'#B1A54E'}} />
         </View>
          <View style={{alignItems:'center',marginTop:10}}>
            <Text>Already a member?</Text>
            <Text onPress={()=>this.props.navigation.navigate('LoginScreen')} style={{color:'darkred',fontSize:20}}>Go to Login</Text>
          </View>
     </ScrollView>
          )
        }
        else
        return(
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size={40} animating color='purple'/>
          </View>
        )
}
}
function mapStateToProps(state){
return({

})
}
function mapActionsToProps(dispatch){
  return({
    setUID:(UID)=>{
      dispatch(setUIDAction(UID))
    }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Signup)