import { FileUploader } from '../components/FileUploader';

export const fileUploaderAdapter = ({ label, props }) => {
	return { Component: FileUploader, label, ...props };
};
