import React, { useEffect, useState } from "react";

import { Modal, Input, Select, Button } from "@bigbinary/neetoui";

import categoriesApi from "../../apis/categories";
import organizationsApi from "../../apis/organizations";

const AddCategory = ({ isOpen, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const {
          data: { organizations },
        } = await organizationsApi.fetch();

        setOrganizations(
          organizations.map(org => ({ label: org.name, value: org.id }))
        );
      } catch (error) {
        logger.error(error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: { category },
      } = await categoriesApi.create({
        name: categoryName,
        organization_name: selectedOrg.label,
      });

      setLoading(false);
      onCategoryAdded(category);
      setCategoryName("");
      setSelectedOrg(null);
      onClose();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onClose}>
      <Modal.Header>Add New Category</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
          <Select
            label="Select Organization"
            options={organizations}
            placeholder="Choose an organization"
            value={selectedOrg}
            onChange={setSelectedOrg}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button label="Add Category" loading={loading} onClick={handleSubmit} />
        <Button label="Cancel" style="text" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};

export default AddCategory;
