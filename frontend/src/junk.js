class ExampleComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      userName: "",
      pass: "",
      redirectToReferrer: false
    };
  }
  componentDidMount() {
    if (this.captchaVerify) {
        console.log("started, just a second...")
        this.captchaVerify.reset();
    }
  }
  onLoadRecaptcha() {
      if (this.captchaVerify) {
          this.captchaVerify.reset();
      }
  }
  verifyCallback(recaptchaToken) {
    // Here you will get the final recaptchaToken!!!  
    console.log(recaptchaToken, "<= your recaptcha token")
  }
  render() {
    return (
      <div>
        {/* You can replace captchaVerify with any ref word */}
        <ReCaptcha
            ref={(el) => {this.captchaVerify = el;}}
            size="normal"
            data-theme="dark"            
            render="explicit"
            sitekey="your_site_key"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
        <code>
          1. Add <strong>your site key</strong> in the ReCaptcha component. <br/>
          2. Check <strong>console</strong> to see the token.
        </code>
      </div>
    );
  };
};
export default ExampleComponent;