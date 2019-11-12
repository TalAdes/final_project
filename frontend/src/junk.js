
    if (!this.props.loggedInUser) {
        <Button
            variant="outlined"
            style={{ marginRight: 20 }}
            color="primary"
            onClick={() => {
                this.props.history.push("/login");
            }}
        >
            Log in
              </Button>
    } else {
        <Avatar
            onClick={event => {
                this.setState({ anchorEl: event.currentTarget });
            }}
            style={{ backgroundColor: "#3f51b5", marginLeft: 50 }}
        >
            <Person />
        </Avatar>
    }
