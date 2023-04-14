$(document).ready(function() {
    // Please write your JS in scripts.js

    console.log('Login ready')

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
    const registerComponent = {
      template: '#signUp',
      name: 'UserLoginComponent',
      data() {
        return {
          user: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            passwordCheck: ''
          },
          valid: true
        };
  
  
      },
      computed: {
        isFormValid() {
          return (
            this.isValid('firstname') &&
            this.isValid('lastname') &&
            this.isValid('email') &&
            this.isValid('password') &&
            this.isValid('passwordCheck'));
        }
      },

      watch: {
      },
  
      methods: {
        isValid(prop) {
          switch (prop) {
            case 'firstname':
              return this.user.firstname.length >= 2;
              break;
            case 'lastname':
              return this.user.lastname.length >= 2;
              break;
            case 'email':
              return emailRegex.test(this.user.email);
              break;
            case 'password':
              return this.user.password.length >= 6;
              break;
            case "passwordCheck":
              return this.user.password === this.user.passwordCheck;
              break;
            default:
              return false;
          }
  
        },
        passwordLength(prop){
            console.log(prop)
        },
        resetUser() {
          this.user.firstname = '';
          this.user.lastname = '';
          this.user.email = '';
          this.user.password = '';
          this.user.passwordCheck = '';
        },
        async onSubmit() {
          let user = Object.assign({}, this.user);
          let response = await fetch("http://localhost:8000/api/createuser", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: user }),
          })
          let readResponse = await response.text();
          this.resetUser();
          this.$emit('register-form', {
            type: 'register',
            data: user
          });
        }
      },
  
      mounted() {
        // Bonus: Password Validation 
        // Can this be refactored?
         let element = this.$el.querySelector('#passwordcheck');
        element.addEventListener('blur', () => {
          !this.isValid('passwordCheck') ? element.classList.add('invalid') : element.classList.remove('invalid');
         });
      }
    };
  
  
    const signInComponent = {
      template: '#signinIn',
      name: 'SigninComponent',
      data() {
        return {
          user: {
            email: '',
            password: ''
          }
        };
  
  
      },
      methods: {
        async handleForm() {
          let formvalue = Object.assign({}, this.user);
          let signInRequest = await fetch("http://localhost:8000/api/signin", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ signInCredentials: formvalue }),
          });
          let readResponse = await signInRequest.text();
          if (readResponse === "success") {
            this.resetFormValues();
            this.$emit('signin-form', {
              type: 'signin',
              data: formvalue
            });
          } else {
            this.resetFormValues();
            this.$emit('signin-form', {
              type: 'signinerror',
              data: formvalue
            });
          }
        },
        resetFormValues() {
          this.user.email = '';
          this.user.password = '';
        },
        isValid(prop) {
          switch (prop) {
            case 'email':
              return emailRegex.test(this.user.email);
              break;
            case 'password':
              return this.user.password.length >= 6;
              break;
            default:
              return false;
          }
  
        }
      },
  
      computed: {
        isFormValid() {
          return this.isValid('email') && this.isValid('password');
        }
      }
    };
  
  
  
    const feedbackComponent = {
      template: '#loginFeedback',
      name: "loginComponent",
      filters: {
        email(input) {
          if (input.email) {
            return input.email;
          } else {
            return '';
          }
        },
        name(input) {
          return input.firstname ? input.firstname : '';
        }
      },
  
      data() {
        return {
          blog: {
            title: '',
            data: '',
            email: '',
          },
          blogs: {
          },
          componentKey: 0,
        };
      },
      props: ['feedback'],
      methods: {
        async getBlogs() {
          let formvalue = Object.assign({}, this.blog);
          formvalue = this.feedback.data.email;
          let response = await fetch(`http://localhost:8000/api/getblogs?email=${formvalue}`, {
            mode: "cors",
            credentials: "include",
          });
          let readResponse = await response.json();
          this.blogs = readResponse;
        },
        async createBlogPost() {
          let formvalue = Object.assign({}, this.blog);
          formvalue.email = this.feedback.data.email;
          let response = await fetch("http://localhost:8000/api/createblog", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ blog: formvalue }),
          })
          let readResponse = await response.text();
          await this.getBlogs();
        this.componentKey += 1;
        },
        async deleteBlogPost(input) {
          let response = await fetch(`http://localhost:8000/api/deleteblog/${input.target.parentElement.parentElement.id}`, {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
          });
          let readResponse = await response.text();
          if (readResponse === "success") {
            input.target.parentElement.parentElement.remove();
          }
        },
        async editBlogPost(input) {
          const newBlog = input.target.parentElement.parentElement.childNodes[1].value;
          const id = input.target.parentElement.parentElement.id;
          let response = await fetch(`http://localhost:8000/api/editblog/${id}`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ newBlog: newBlog }),
          });
          let readResponse = await response.text();
        },
      },
      computed: {
        title() {
          return this.feedback.type === 'signin' ?
            'Login Successful!' : 'Sign Up';
        }
      },
      async mounted() {
        let formvalue = Object.assign({}, this.blog);
        formvalue = this.feedback.data.email;
        await this.getBlogs();
      },
    };
  
    const app = new Vue({
      el: '#app',
      components: {
        register: registerComponent,
        signin: signInComponent,
        feedback: feedbackComponent
      },
  
      name: 'application',
      data() {
        return {
          feedback: {},
          currentComponent: 'register',
        };
  
      },
      methods: {
        handleForm(data) {
          this.feedback = data;
          setTimeout(() => {
            this.setView('feedback');
          }, 280);
        },
        isDisabled(btnName) {
          const signInBtn = document.getElementById("sign-in-id");
          const registerBtn = document.getElementById("register-id");
          if (btnName === "signin") {
            signInBtn.style.backgroundColor = "#5AC8E0";
            signInBtn.style.color = "white";
            signInBtn.style.opacity = "1";
            registerBtn.style.backgroundColor = "lightgray";
            registerBtn.style.opacity = ".8";
            registerBtn.style.color = "black";
          }
          return this.currentComponent === btnName;
        },
        setView(componentName) {
          if (this.currentComponent !== componentName) {
            this.currentComponent = componentName;
          }
        }
      }
    });

  })
  