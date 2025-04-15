import * as M from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { submitFormData } from '../../../services';
import { StateManager } from '../../../../state/state';

import { clone } from '../../../utils';
import { enhanceResults } from '../../../utils/parseProperties';
import { getFilledQueryParams } from '../../../utils/getFilledQueryParams';

import Outputs from './Outputs';
import { SetData } from '../SetData';
import ParseWorkflowData from './ParseWorkflowData';
import { FlowComponentProps, GenericProps } from '../types';
import _ from 'lodash';

type QueryArgs = FlowComponentProps & {
	proc?: string;
	procArgs?: string;
	exec?: string;
	call?: string;
	flatParams?: string | boolean;
	showLoading?: boolean;
	softError?: boolean;
};

type Statuses = 'ready_to_submit' | 'submitting' | 'loading' | Error;

export const Query = (args: QueryArgs) => {
	const [status, setStatus] = useState<Statuses>('ready_to_submit');

	const {
		debug, // comes from config
		children = [],
		softError,

		exec,
		call,
		flatParams: flatten,
		showLoading = false,

		onStep, // comes from flow
		onExit, // comes from flow
		flowArgs, // comes from flow
		...propsRest
	} = args;

	let { proc, procArgs } = args;
	if (exec && !proc && !procArgs) {
		proc = 'ui.sp_Upsert';
		procArgs = exec;
	}

	if (debug) {
		console.log({
			_: 'Query',
			args,
		});
	}

	const params = useMemo(() => {
		const global = clone(StateManager.get());

		const paramsFilled = getFilledQueryParams(
			propsRest,
			{
				global,
				flowArgs,
			},
			{ debug: Boolean(debug) },
		);

		if (debug) {
			console.log({
				_: 'Query:Params',
				paramsFilled,
				propsRest,
				global,
				flowArgs,
			});
		}

		if (procArgs) {
			Object.assign(paramsFilled, {
				key: procArgs,
			});
		}

		return paramsFilled;
	}, [proc, procArgs, flowArgs]);

	const onSuccess = async (results: any) => {
		if (debug) {
			console.log({
				_: 'Query:Success',
				propsRest,
				children,
				results,
				flowArgs,
			});
		}

		// ? This needs to be async because other components may depend on the outcomes of these ones.
		await new Promise((res) => {
			Outputs.handleProps(propsRest, results);
			ParseWorkflowData.handleResults(children, results);

			const setDataComponents = children.filter(
				(x: GenericProps) => x.type === 'SetData',
			);
			setDataComponents.forEach(({ props }, length) => {
				const isLast = length === setDataComponents.length - 1;
				const _onStep = isLast ? res : undefined;
				SetData({ ...props, onStep: _onStep, results, flowArgs });
			});

			if (_.isEmpty(setDataComponents)) {
				res(undefined);
			}
		});

		setStatus('ready_to_submit');
		onStep && onStep();
	};

	const onError = (error: Error | string) => {
		console.log(error);
		if (error instanceof Error) {
			setStatus(error);
		} else {
			setStatus(new Error(error));
		}
	};

	const onRetry = () => {
		setStatus('ready_to_submit');
	};

	const submitStep = async ({
		__name,
		__call,
		__flatten,
		__params,
	}: {
		__name?: string;
		__call?: string;
		__flatten?: string | boolean;
		__params?: Record<string, any>;
	}) => {
		setStatus('submitting');

		const input = [
			{
				name: __name,
				call: __call,
				flatten: __flatten,
				args: JSON.stringify(__params),
			},
		];

		if (debug) {
			console.log({
				_: 'Query:Submit',
				...input[0],
				args: __params,
			});
		}

		const [data] = await submitFormData(input);
		if (!softError && data.error) {
			onError(data.error);
			return;
		}
		if (softError && data.error) {
			const resultsEnhanced = enhanceResults([{ error: data.error }]);
			onSuccess(resultsEnhanced);
			return;
		}
		const resultsEnhanced = enhanceResults(data.results);
		onSuccess(resultsEnhanced);
	};

	useEffect(() => {
		const allUnavailable = !call && !proc && !submitStep;
		if (status !== 'ready_to_submit' || allUnavailable) {
			return;
		}

		submitStep({
			__name: proc,
			__call: call,
			__flatten: flatten,
			__params: params,
		}).catch((error) => {
			onError(error);
		});
	}, [params, status]);

	if (status === 'submitting' && showLoading) {
		return (
			<M.Backdrop open>
				<M.CircularProgress sx={{ color: 'white' }} />
			</M.Backdrop>
		);
	}

	if (status instanceof Error) {
		return (
			<M.Dialog open fullWidth>
				{/* <M.DialogTitle>Error</M.DialogTitle> */}
				<M.DialogContent>
					<M.Alert
						severity="error"
						icon={false}
						style={{ marginTop: '1em' }}
					>
						<M.AlertTitle>Error</M.AlertTitle>
						<pre style={{ whiteSpace: 'pre-line' }}>
							{status.message}
						</pre>
					</M.Alert>
				</M.DialogContent>
				<M.DialogActions>
					<M.Button
						variant="outlined"
						onClick={onExit}
						color="secondary"
					>
						Cancel
					</M.Button>
					<M.Button
						variant="contained"
						onClick={onRetry}
						color="primary"
					>
						Retry
					</M.Button>
				</M.DialogActions>
			</M.Dialog>
		);
	}

	return null;
};
