import { Component } from 'react';
import { Stack } from '@mui/material';
import { WIP } from '../WIP';

class ErrorBoundary extends Component {
	props: any;
	state: any;

	constructor(props: any) {
		super(props);
		this.state = { error: null, errorInfo: null };
		this.handleReset = this.handleReset.bind(this);
	}

	componentDidCatch(error: any, errorInfo: any) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}
	handleReset() {
		this.setState({ error: null, errorInfo: null });
	}
	componentDidUpdate(prevProps: any) {
		try {
			if (this.props.variant !== 'page') return;
			const [nextRoot] = this.props?.context;
			const [prevRoot] = prevProps?.context;
			if (!prevRoot?.key && !nextRoot?.key) return;
			if (prevRoot?.key === nextRoot?.key) return;
			this.handleReset();
		} catch (e) {}
	}
	render() {
		if (!this.state.errorInfo) {
			return this.props.children;
		}
		if (this.props.variant === 'page') {
			return (
				<Stack {...{ variant: 'page' }}>
					<Stack {...{ variant: 'page-content' }}>
						<Stack
							alignItems="center"
							justifyContent="center"
							marginTop="10rem"
						>
							<WIP wip={false} navigate={false} />
						</Stack>
					</Stack>
				</Stack>
			);
		}
		return (
			<Stack alignItems="center" justifyContent="center">
				<WIP wip={false} handleReset={this.handleReset} />
			</Stack>
		);
	}
}

//TODO: add a simple error boundary here for use on component level:
// - custom components
// - MUI general components
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

export class ErrorBoundaryBasic extends Component {
	props: any;
	state: any;

	constructor(props: any) {
		super(props);
		this.state = { error: null, errorInfo: null };
		this.handleReset = this.handleReset.bind(this);
	}

	componentDidCatch(error: any, errorInfo: any) {
		this.setState({
			error,
			errorInfo,
		});
	}
	handleReset() {
		this.setState({ error: null, errorInfo: null });
	}
	render() {
		if (this.state.errorInfo) {
			return <div className="error"></div>;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
