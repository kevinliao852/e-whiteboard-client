import React from 'react'

import {
    Divider,
    Transition,
    Grid,
    Icon,
    Menu,
    Segment,
    Sidebar,
    Label,
    Container,
} from 'semantic-ui-react';

import '../css/style.css';


const SideBar = (props: { children: Array<JSX.Element> }) => {
    const [visible, setVisible] = React.useState(false)
    const [chatboxVisible, setChatBoxVisible] = React.useState(false)
    const buttonOnClick = (e: any, data: any) => setVisible(!visible)


    const toggleChatBoxVisibility = () => {
        setChatBoxVisible(!chatboxVisible)
    }

    return (
        <Grid columns={1}>
            <Grid.Column>
                <div>
                    <Label as='button' color='teal' image onClick={buttonOnClick}>
                        <Label.Detail>Tools</Label.Detail>
                    </Label>
                    <Label as='button' color='blue' image>
                        <Label.Detail>ReLoad</Label.Detail>
                    </Label>
                    <Label as='button' color='yellow' image>
                        <Label.Detail>Save Contents</Label.Detail>
                    </Label>
                    <Label as='button' color='purple' image onClick={toggleChatBoxVisibility}>
                        <Label.Detail>Chat</Label.Detail>
                    </Label>
                </div>
            </Grid.Column>
            <Grid.Column>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={() => setVisible(false)}
                        vertical
                        visible={visible}
                        width='thin'
                    >
                        <Menu.Item as='a'>
                            <Icon name='magic' />
                            color
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='paint brush' />
                            size
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='eraser' />
                            eraser
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='trash' />
                            delete
                        </Menu.Item>

                    </Sidebar>

                    <Sidebar.Pusher dimmed={visible}>
                        <Divider hidden />
                        <Transition visible={chatboxVisible} animation='scale' duration={100}>
                            <Container id=".whiteboard">
                                {props.children[1]}
                            </Container>
                        </Transition>
                        <Transition visible={!chatboxVisible} animation='scale' duration={100}>
                            <Container id="chatbox">
                                {props.children[0]}
                            </Container>
                        </Transition>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Grid.Column>
        </Grid>
    )
}

export default SideBar
