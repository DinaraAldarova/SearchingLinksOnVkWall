import React from "react";
import PropTypes from "prop-types";

import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    PanelHeaderBack,
} from "@vkontakte/vkui";

const ErrorAuth = ({ id, go }) => (
    <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={props.go} data-to="home" />}>
            Ошибка
        </PanelHeader>
        <Div>
            Произошла ошибка при запросе прав
        </Div>
    </Panel>
);
//TODO: После этого надо попытаться еще раз запросить права!

ErrorAuth.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default ErrorAuth;
