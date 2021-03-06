package eu.city4age.dashboard.api.pojo.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;

import eu.city4age.dashboard.api.pojo.json.view.View;

/**
 * NumericIndicatorValue generated by hbm2java
 */
@Entity
@Table(name = "numeric_indicator_value")
public class NumericIndicatorValue implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2422155784673783252L;
	
	@Id
	@Basic(optional = false)
	@SequenceGenerator(name = "nui_seq", sequenceName = "numeric_indicator_value_id_seq", allocationSize = 1)
	@GeneratedValue(generator = "nui_seq", strategy = GenerationType.SEQUENCE)
	@Column(name = "id", insertable = true, updatable = true, unique = true, nullable = false)
	protected Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@JsonView(View.NUIView.class)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nui_type_id")
	private DetectionVariable detectionVariable;

	@JsonView(View.NUIView.class)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "time_interval_id", referencedColumnName = "id")
	private TimeInterval timeInterval;

	@JsonView(View.NUIView.class)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_in_role_id")
	private UserInRole userInRole;
	
	@JsonView(View.NUIView.class)
	@Column(name = "nui_value", precision = 20, scale = 8)
	private BigDecimal nuiValue;

	@Column(name = "data_source_type", length = 1000)
	private String dataSourceType;
	// private Set interActivityBehaviourVariations = new HashSet(0);

	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	@OneToMany(mappedBy = "numericIndicatorValue", fetch = FetchType.LAZY)
	private Set<InterActivityBehaviourVariation> interActivityBehaviourVariations = new HashSet<InterActivityBehaviourVariation>(0);

	public NumericIndicatorValue() {
	}

	public NumericIndicatorValue(String dataSourceType, DetectionVariable detectionVariable,
			TimeInterval timeInterval, BigDecimal nuiValue) {

		this.dataSourceType = dataSourceType;
		this.detectionVariable = detectionVariable;
		this.timeInterval = timeInterval;
		this.nuiValue = nuiValue;
	}

	public NumericIndicatorValue(DetectionVariable detectionVariable, String dataSourceType,
			TimeInterval timeInterval, UserInRole userInRole, BigDecimal nuiValue, 
			Set<InterActivityBehaviourVariation> interActivityBehaviourVariations) {

		this.dataSourceType = dataSourceType;
		this.detectionVariable = detectionVariable;
		this.timeInterval = timeInterval;
		this.userInRole = userInRole;
		this.nuiValue = nuiValue;
		this.interActivityBehaviourVariations = interActivityBehaviourVariations;
	}

	public DetectionVariable getDetectionVariable() {
		return detectionVariable;
	}

	public void setDetectionVariable(DetectionVariable detectionVariable) {
		this.detectionVariable = detectionVariable;
	}

	public TimeInterval getTimeInterval() {
		return this.timeInterval;
	}

	public void setTimeInterval(TimeInterval timeInterval) {
		this.timeInterval = timeInterval;
	}

	public UserInRole getUserInRole() {
		return this.userInRole;
	}

	public void setUserInRole(UserInRole userInRole) {
		this.userInRole = userInRole;
	}

	public BigDecimal getNuiValue() {
		return this.nuiValue;
	}

	public void setNuiValue(BigDecimal nuiValue) {
		this.nuiValue = nuiValue;
	}

	public String getDataSourceType() {
		return this.dataSourceType;
	}

	public void setDataSourceType(String dataSourceType) {
		this.dataSourceType = dataSourceType;
	}

	public Set<InterActivityBehaviourVariation> getInterActivityBehaviourVariations() {
		return this.interActivityBehaviourVariations;
	}	

	public void setInterActivityBehaviourVariations(Set<InterActivityBehaviourVariation> interActivityBehaviourVariations) {
		this.interActivityBehaviourVariations = interActivityBehaviourVariations;
	}

}
